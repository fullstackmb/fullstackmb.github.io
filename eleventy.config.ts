import { renderToString } from 'jsx-async-runtime';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
let isRebuilding = false;

const isDev = process.argv.some(arg => 
  arg.includes('--serve') || 
  arg.includes('--watch')
);

export default function (eleventyConfig) {
  eleventyConfig.addWatchTarget('./src/**/*');
  eleventyConfig.addWatchTarget('./pages/**/*');
  eleventyConfig.addWatchTarget('./src/_data/**/*');
  eleventyConfig.addPassthroughCopy('src/styles');
  eleventyConfig.addPassthroughCopy('src/components/client');
  eleventyConfig.addPassthroughCopy({ 'public/images': 'images' });
  eleventyConfig.addPassthroughCopy('assets');

   // Add this new collection
   eleventyConfig.addGlobalData('events', async function() {
    // Get the events data
    const events = await import('./src/_data/events.js');
    return events.default ? await events.default() : [];
  });

   eleventyConfig.addGlobalData('version', async function() {
    // Get the events data
    const version = await import('./src/_data/version.js');
    return version.default ? await version.default() : [];
  });

  eleventyConfig.addExtension(['11ty.jsx', '11ty.tsx', '.tsx', '.ts'], {
    key: '11ty.js',
    compile: async (str, inputPath) => {
      
      return async (data) => {
        try {
          if (inputPath.includes('src/') && isDev) {
            
            try {
              // Use execSync instead of exec
              exec('npm run build', (error, stdout, stderr) => {
                if (error) {
                  console.error(`Error during rebuild: ${error.message}`);
                  return;
                }
  
              });
            } catch (error) {
              console.error(`Error during rebuild: ${error}`);
            }
          }
          
          // Convert the input path to an absolute file URL
          const absolutePath = path.resolve(process.cwd(), inputPath);
          const fileUrl = new URL(`file://${absolutePath}`);
          
          // Clear module cache
          const cacheKey = fileUrl.href;
          // console.log(Symbol.for('tsx-cache'), globalThis)
          delete globalThis[Symbol.for('tsx-cache')]?.[cacheKey];
          // globalThis.clearImmediate(Symbol.for('nodejs.util.promisify.custom'));

          
          // Import the module
          const module = await import(fileUrl.href);
          const component = module.default || module.render;
          
          if (!component) {
            throw new Error(`No default export or 'render' export found in ${inputPath}`);
          }

          const content = component(data);
          return await renderToString(content);
        } catch (error) {
          console.error(`Error processing ${inputPath}:`, error);
          throw error;
        }
      };
    }
  });

  return {
    ...eleventyConfig,
    dir: {
      input: './pages',
      layouts: '../src/_layouts',
      output: '_site',
      data: './src/_data',
    },
    pathPrefix: '/',
    markdownTemplateEngine: false,
    htmlTemplateEngine: false,
    server: {
      port: 8080
    }
  };
}