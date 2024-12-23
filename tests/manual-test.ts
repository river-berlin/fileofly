import { applyFileModification } from '../src/index';

async function runTests() {
  try {
    // Test 1: Create a new file
    console.log('\n🧪 Testing file creation...');
    await applyFileModification('Create a new file test.txt with content "Hello World"');
    console.log('✅ Create file test passed');

    // Test 2: Update specific lines
    console.log('\n🧪 Testing line updates...');
    await applyFileModification('Update lines 2-4 in test.txt with "New Content"');
    console.log('✅ Update lines test passed');

    // Test 3: Update last line
    console.log('\n🧪 Testing last line update...');
    await applyFileModification('Update the last line in test.txt with "Final Line"');
    console.log('✅ Update last line test passed');

    // Test 4: Delete file
    console.log('\n🧪 Testing file deletion...');
    await applyFileModification('Delete the file test.txt');
    console.log('✅ Delete file test passed');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
console.log('🚀 Starting manual tests...');
runTests().then(() => {
  console.log('\n�� All tests completed');
}); 