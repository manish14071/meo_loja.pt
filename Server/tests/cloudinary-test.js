import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function testCloudinaryConfig() {
  console.log('\nTesting Cloudinary Configuration...\n');
  
  // Log masked credentials for verification
  console.log('Cloudinary Credentials Check:');
  console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'Not Set');
  console.log('API_KEY:', process.env.CLOUDINARY_API_KEY ? 
    `${process.env.CLOUDINARY_API_KEY.slice(0, 4)}...${process.env.CLOUDINARY_API_KEY.slice(-4)}` : 'Not Set');
  console.log('API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 
    `${process.env.CLOUDINARY_API_SECRET.slice(0, 4)}...${process.env.CLOUDINARY_API_SECRET.slice(-4)}` : 'Not Set');

  try {
    // Configure cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Test the configuration
    const result = await cloudinary.api.ping();
    console.log('\nPing test result:', result);
    return true;
  } catch (error) {
    console.error('\nConfiguration Error:', {
      message: error.message,
      http_code: error.http_code
    });
    return false;
  }
}

// Run the test
testCloudinaryConfig()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });