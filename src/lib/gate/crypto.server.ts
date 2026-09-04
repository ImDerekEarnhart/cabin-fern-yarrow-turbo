import { createHash, generateKeyPairSync, sign as nodeSign, verify as nodeVerify } from "node:crypto";
import { getSql } from "@/lib/db";

export function sha256(input: string | Uint8Array) {
  return createHash("sha256").update(input).digest("hex");
}

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${canonicalJson(obj[k])}`)
    .join(",")}}`;
}

type KeyRow = { public_pem: string; private_pem: string; fingerprint: string };

export async function requireUserKeys(userId: string): Promise<KeyRow> {
  const sql = await getSql();
  const existing = await sql<KeyRow>`
    select public_pem, private_pem, fingerprint from release_keys where user_id = ${userId}
  `;
  if (existing[0]) return existing[0];
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  const publicPem = publicKey.export({ type: "spki", format: "pem" }).toString();
  const privatePem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  const fingerprint = sha256(publicKey.export({ type: "spki", format: "der" }));
  await sql`
    insert into release_keys (user_id, public_pem, private_pem, fingerprint)
    values (${userId}, ${publicPem}, ${privatePem}, ${fingerprint})
  `;
  return { public_pem: publicPem, private_pem: privatePem, fingerprint };
}

export function signCanonical(canonical: string, privatePem: string) {
  return nodeSign(null, Buffer.from(canonical), privatePem).toString("base64");
}

export function verifyCanonical(canonical: string, signatureB64: string, publicPem: string) {
  try {
    return nodeVerify(null, Buffer.from(canonical), publicPem, Buffer.from(signatureB64, "base64"));
  } catch {
    return false;
  }
}
