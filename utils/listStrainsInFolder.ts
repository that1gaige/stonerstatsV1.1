import { listStrainJSONFiles, readStrainJSON } from "./strainJSONWriter";

export async function listAllStrainFiles(): Promise<void> {
  console.log('\n=== STRAIN LIBRARY CONTENTS ===\n');
  
  const files = await listStrainJSONFiles();
  
  if (files.length === 0) {
    console.log('No strain JSON files found in /strains folder.');
    return;
  }
  
  console.log(`Found ${files.length} strain file(s):\n`);
  
  for (const filename of files) {
    const strainId = filename.replace('.json', '');
    const content = await readStrainJSON(strainId);
    
    if (content) {
      try {
        const data = JSON.parse(content);
        console.log(`📄 ${filename}`);
        console.log(`   Name: ${data.identity.name}`);
        console.log(`   Type: ${data.identity.type}`);
        console.log(`   Terps: ${data.identity.terp_profile.join(', ') || 'None'}`);
        console.log(`   Breeder: ${data.identity.breeder || 'Unknown'}`);
        console.log(`   Icon Seed: ${data.icon.icon_seed}`);
        console.log(`   Gradient: ${data.icon.icon_render_params.gradient.enabled ? 'Yes' : 'No'}`);
        if (data.icon.icon_render_params.gradient.enabled) {
          console.log(`   Gradient Colors: ${data.icon.icon_render_params.gradient.stops.length}`);
        }
        console.log('');
      } catch (error) {
        console.error(`   ❌ Failed to parse: ${error}`);
      }
    }
  }
  
  console.log('=================================\n');
}

export async function getStrainLibrarySummary() {
  const files = await listStrainJSONFiles();
  
  const summary = {
    total: files.length,
    files: files,
  };
  
  console.log('\n📊 Strain Library Summary:');
  console.log(`   Total strains: ${summary.total}`);
  console.log(`   Files: ${summary.files.join(', ') || 'None'}`);
  
  return summary;
}
