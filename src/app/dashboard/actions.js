"use server";

/**
 * Dashboard Server Actions.
 *
 * Yahan daily check-in save hota hai. KEY IDEA (requirement):
 *   - User jo bhi personal cheez likhta hai (mood, sleep, energy, note) usse hum
 *     encrypt karke DB me daalte hain (ciphertext). DB me plain text kabhi nahi jata.
 *   - Padhte waqt (dashboard) hum decrypt karke user ko readable data dikhate hain.
 * Encryption/decryption dono server par hote hain — key (ENCRYPTION_KEY) browser me nahi jaati.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { encryptJSON } from "@/lib/encryption";

export async function addCheckin(prevState, formData) {
  const supabase = await createClient();

  // Auth check — bina login ke koi check-in save nahi kar sakta.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Form se values (numbers ko clamp/parse kar lo)
  const payload = {
    mood: clampInt(formData.get("mood"), 1, 5),
    sleep: clampInt(formData.get("sleep"), 0, 24),
    energy: clampInt(formData.get("energy"), 1, 5),
    note: String(formData.get("note") || "").slice(0, 1000), // journal note (private)
  };

  // Pura object ek hi encrypted string me convert — yahi DB column me jayega.
  const dataEncrypted = encryptJSON(payload);

  // RLS policy (schema.sql) ke kaaran user sirf apni row hi insert kar sakta hai;
  // user_id hum explicitly set karte hain.
  const { error } = await supabase.from("checkins").insert({
    user_id: user.id,
    data_encrypted: dataEncrypted,
  });

  if (error) {
    return { error: "Check-in save nahi ho paaya: " + error.message };
  }

  // Dashboard ka cache refresh karo taaki naya check-in turant dikhe.
  revalidatePath("/dashboard");
  return { success: true };
}

// Chhota helper: string ko safe integer me badalta hai aur range me rakhta hai.
function clampInt(value, min, max) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}
