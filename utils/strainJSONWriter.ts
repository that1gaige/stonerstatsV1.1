import AsyncStorage from '@react-native-async-storage/async-storage';
import { Strain } from "@/types";
import { generateStrainJSON } from "./iconGenerator";

const STORE_KEY = 'stonerstats_strains_json_store';

function filenameFromStrainName(name: string): string {
  const normalized = name.trim().replace(/\s+/g, "_");
  return `${normalized}.json`;
}

export async function ensureStrainsDirectory(): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(STORE_KEY);
    if (!existing) {
      await AsyncStorage.setItem(STORE_KEY, JSON.stringify({}));
    }
    console.log('[StrainJSON] Using app-root "/strains" backed by AsyncStorage');
  } catch (error) {
    console.error('[StrainJSON] Failed to init /strains store:', error);
    throw error;
  }
}

export async function writeStrainJSON(strain: Strain): Promise<void> {
  try {
    const json = generateStrainJSON(strain);
    await ensureStrainsDirectory();
    const storeRaw = await AsyncStorage.getItem(STORE_KEY);
    const store = storeRaw ? (JSON.parse(storeRaw) as Record<string, string>) : {};

    // filename is based on strain name per requirements
    const filename = filenameFromStrainName(strain.name);
    store[filename] = json as string;

    // remove any legacy entry keyed by strain_id
    if (store[strain.strain_id]) {
      delete store[strain.strain_id];
    }

    await AsyncStorage.setItem(STORE_KEY, JSON.stringify(store));
    console.log(`[StrainJSON] Stored /strains/${filename}`);
  } catch (error) {
    console.error(`[StrainJSON] Failed to write strain JSON for ${strain.name}:`, error);
    throw error;
  }
}

export async function deleteStrainJSONByName(strainName: string): Promise<void> {
  try {
    const storeRaw = await AsyncStorage.getItem(STORE_KEY);
    const store = storeRaw ? (JSON.parse(storeRaw) as Record<string, string>) : {};
    const filename = filenameFromStrainName(strainName);
    if (store[filename]) {
      delete store[filename];
      await AsyncStorage.setItem(STORE_KEY, JSON.stringify(store));
      console.log(`[StrainJSON] Deleted /strains/${filename}`);
    }
  } catch (error) {
    console.error(`[StrainJSON] Failed to delete strain JSON for ${strainName}:`, error);
    throw error;
  }
}

export async function readStrainJSONByName(strainName: string): Promise<string | null> {
  try {
    const storeRaw = await AsyncStorage.getItem(STORE_KEY);
    const store = storeRaw ? (JSON.parse(storeRaw) as Record<string, string>) : {};
    const filename = filenameFromStrainName(strainName);
    return store[filename] ?? null;
  } catch (error) {
    console.error(`Failed to read strain JSON for ${strainName}:`, error);
    return null;
  }
}

export async function listStrainJSONFiles(): Promise<string[]> {
  try {
    await ensureStrainsDirectory();
    const storeRaw = await AsyncStorage.getItem(STORE_KEY);
    const store = storeRaw ? (JSON.parse(storeRaw) as Record<string, string>) : {};
    const keys = Object.keys(store);
    console.log(`[StrainJSON] Found ${keys.length} JSON file(s) in /strains`);
    return keys;
  } catch (error) {
    console.error('[StrainJSON] Failed to list strain JSON files:', error);
    return [];
  }
}
