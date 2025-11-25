import { db } from "./db";
import { EXPLORE_STRAINS_DATA } from "@/constants/exploreStrains";
import { hashPassword } from "./auth";
import { generateIconParams } from "@/utils/iconGenerator";

export async function seedDatabase() {
  console.log("[Seed] Starting database seed...");

  const existingUsers = db.getAllUsers();
  if (existingUsers.length > 0) {
    console.log("[Seed] Database already seeded, skipping...");
    return;
  }

  const demoUserId1 = "user_demo_1";
  const demoUserId2 = "user_demo_2";
  const demoUserId3 = "user_demo_3";
  const demoPassword = await hashPassword("demo123");
  
  db.createUser({
    user_id: demoUserId1,
    email: "demo@stonerstats.com",
    password_hash: demoPassword,
    display_name: "Demo User",
    handle: "demouser",
    created_at: new Date().toISOString(),
    following_user_ids: [],
    preferences: {
      default_unit: "g",
      dark_mode: true,
      notifications_enabled: true,
      privacy_level: "public",
    },
  });

  db.createUser({
    user_id: demoUserId2,
    email: "sarah@stonerstats.com",
    password_hash: demoPassword,
    display_name: "Sarah Green",
    handle: "sarahgreen",
    created_at: new Date().toISOString(),
    following_user_ids: [],
    preferences: {
      default_unit: "g",
      dark_mode: true,
      notifications_enabled: true,
      privacy_level: "public",
    },
  });

  db.createUser({
    user_id: demoUserId3,
    email: "mike@stonerstats.com",
    password_hash: demoPassword,
    display_name: "Mike Trees",
    handle: "miketrees",
    created_at: new Date().toISOString(),
    following_user_ids: [],
    preferences: {
      default_unit: "g",
      dark_mode: true,
      notifications_enabled: true,
      privacy_level: "public",
    },
  });

  console.log("[Seed] Created 3 demo users");

  const demoStrains = EXPLORE_STRAINS_DATA.slice(0, 10);
  
  for (const strainData of demoStrains) {
    const strainId = `strain_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const { seed, params } = generateIconParams(strainData.name, strainData.type, strainData.terp_profile as any);
    
    db.createStrain({
      strain_id: strainId,
      name: strainData.name,
      type: strainData.type,
      terp_profile: strainData.terp_profile as any,
      description: strainData.description,
      icon_seed: seed,
      icon_render_params: params,
      created_at: new Date().toISOString(),
    });
  }

  console.log(`[Seed] Created ${demoStrains.length} demo strains`);

  const methods = ["joint", "bong", "pipe", "vape", "edible"] as const;
  const effects = [
    "relaxed", "happy", "euphoric", "uplifted", "creative",
    "focused", "energetic", "sleepy", "hungry", "giggly"
  ];

  const allStrains = db.getAllStrains();
  const demoUserIds = [demoUserId1, demoUserId2, demoUserId3];

  for (let i = 0; i < 15; i++) {
    const strain = allStrains[i % allStrains.length];
    const sessionId = `session_demo_${i}`;
    const userId = demoUserIds[i % demoUserIds.length];
    
    db.createSession({
      session_id: sessionId,
      user_id: userId,
      strain_id: strain.strain_id,
      method: methods[i % methods.length],
      amount: 0.5 + Math.random() * 1.5,
      amount_unit: "g",
      mood_before: Math.floor(Math.random() * 3) + 2,
      mood_after: Math.floor(Math.random() * 2) + 4,
      effects_tags: effects.sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 3)),
      notes: `Great ${strain.type} experience with ${strain.name}. ${strain.terp_profile ? `Really enjoyed the ${strain.terp_profile[0]} notes.` : ''}`,
      photo_urls: [],
      created_at: new Date(Date.now() - (i * 4 * 60 * 60 * 1000)).toISOString(),
      likes: [],
    });
  }

  console.log("[Seed] Created 15 demo sessions");
  console.log("[Seed] Database seeded successfully!");
}
