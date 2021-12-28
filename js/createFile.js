const fs = require('fs');
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const createEmptyFileOfSize = (fileName, size) => {
  return new Promise((resolve, reject) => {
    // Check size
    if (size < 0) {
        reject("Error: a negative size doesn't make any sense")
        return;
    }

    // Will do the processing asynchronously
    setTimeout(() => {
        try {
          // Open the file for writing; 'w' creates the file 
          // (if it doesn't exist) or truncates it (if it exists)
          fd = fs.openSync(fileName, 'w');
          if (size > 0) {
              // Write one byte (with code 0) at the desired offset
              // This forces the expanding of the file and fills the gap
              // with characters with code 0
              fs.writeSync(fd, Buffer.alloc(1), 0, 1, size - 1);
          }
          // Close the file to commit the changes to the file system
          fs.closeSync(fd);

          // Promise fulfilled
          resolve(true);
        } catch (error) {
          // Promise rejected
          reject(error);
        }
    // Create the file after the processing of the current JavaScript event loop
    }, 0)
  });
};


// rl.question('Enter file name: ', (filename) => {
//     if (filename) {
//         rl.question('Enter file size in MB', (size) => {
//             if (size) {
//                 createEmptyFileOfSize('speed_test', 1024*1024*1024);
//             }
//         })
//     }
// })
(() => {
        rl.question('Enter file name: ', (filename) => {
        if (filename) {
            rl.question('Enter file size in MB', async (sizeStr) => {
                if (sizeStr) {
                    const size = Number(sizeStr) 
                    if (!isNaN(size)) {

                    }
                    const created = await createEmptyFileOfSize(filename, 1024*1024*size);
                    if (!created) {
                        console.log("Error creating file")
                    } else {
                        console.log("********* Created File: ", filename)
                    }
                    process.exit()
                }
            })
        }
    })
})()