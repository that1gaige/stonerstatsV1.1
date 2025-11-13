import { protectedProcedure, publicProcedure } from "../../create-context";
import { z } from "zod";
import { db } from "../../../db";
import { TRPCError } from "@trpc/server";

export const createStrainProcedure = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      type: z.enum(["indica", "sativa", "hybrid"]),
      terp_profile: z.array(z.string()).optional(),
      breeder: z.string().optional(),
      description: z.string().optional(),
      icon_seed: z.string(),
      icon_render_params: z.any(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const strainId = `strain_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const strain = {
      strain_id: strainId,
      name: input.name,
      type: input.type,
      terp_profile: input.terp_profile,
      breeder: input.breeder,
      description: input.description,
      icon_seed: input.icon_seed,
      icon_render_params: input.icon_render_params,
      created_at: new Date().toISOString(),
      created_by: ctx.userId,
      source: "user" as const,
    };

    db.createStrain(strain);

    console.log("Strain created:", strainId, input.name);

    return {
      strain_id: strain.strain_id,
      name: strain.name,
      type: strain.type,
      terp_profile: strain.terp_profile,
      breeder: strain.breeder,
      description: strain.description,
      icon_seed: strain.icon_seed,
      icon_render_params: strain.icon_render_params,
      created_at: new Date(strain.created_at),
      created_by: strain.created_by,
      source: strain.source,
    };
  });

export const getAllStrainsProcedure = publicProcedure.query(async () => {
  const strains = db.getAllStrains();
  
  return strains.map((strain) => ({
    strain_id: strain.strain_id,
    name: strain.name,
    type: strain.type,
    terp_profile: strain.terp_profile,
    breeder: strain.breeder,
    description: strain.description,
    icon_seed: strain.icon_seed,
    icon_render_params: strain.icon_render_params,
    created_at: new Date(strain.created_at),
    created_by: strain.created_by,
    source: strain.source,
    aliases: strain.aliases,
    lineage: strain.lineage,
    provenance: strain.provenance,
    detected_keywords: strain.detected_keywords,
    dominant_hue: strain.dominant_hue,
  }));
});

export default {
  create: createStrainProcedure,
  getAll: getAllStrainsProcedure,
};
