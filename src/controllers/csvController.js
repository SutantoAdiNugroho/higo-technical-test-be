const fs = require('fs');
const csv = require('csv-parser');
const Customers = require('../models/Customers');

const BATCH_SIZE = 50000;

const uploadCsv = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const records = [], filePath = req.file.path;
  let uploadedCount = 0, batchCounter = 0;

  try {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        records.push({
          number: parseInt(data['Number']),
          nameOfLocation: data['Name of Location'],
          date: new Date(data['Date']),
          loginHour: data['Login Hour'],
          name: data['Name'],
          age: parseInt(data['Age']),
          gender: data['gender'],
          email: data['Email'],
          phoneNumber: data['No Telp'],
          brandDevice: data['Brand Device'],
          digitalInterest: data['Digital Interest'],
          locationType: data['Location Type'],
        });

        // jika ukuran batch tercapai, masukkan ke DB
        if (records.length >= BATCH_SIZE) {
          const currentBatch = [...records];
          records.length = 0;

          // insert many customer documents per batch size
          Customers.insertMany(currentBatch, { ordered: false })
            .then(docs => {
              uploadedCount += docs.length;
              console.log(`Batch ${++batchCounter} inserted with ${docs.length} records.`);
            })
            .catch(dbError => {
              console.error(`Error in batch insert ${batchCounter}:`, dbError.message);
              // handle specific errors like duplicate keys
              if (dbError.code === 11000) {
                  console.error('Duplicate key error in batch:', dbError.writeErrors.map(e => e.op.ID));
              }
            });
        }
      })
      .on('end', async () => {
        // setelah semua data CSV dibaca, memasukkan sisa data yang belum mencapai ukuran batch
        if (records.length > 0) {
          try {
            const finalBatchDocs = await Customers.insertMany(records, { ordered: false });
            uploadedCount += finalBatchDocs.length;
            console.log(`Last batch inserted: ${finalBatchDocs.length} records.`);
          } catch (dbError) {
            console.error('Error in final batch insert:', dbError.message);
            if (dbError.code === 11000) {
                console.error('Duplicate key error in last batch:', dbError.writeErrors.map(e => e.op.ID));
            }
          }
        }

        fs.unlinkSync(filePath);
        res.status(200).send({
          message: `CSV processing finished. Uploaded ${uploadedCount} records`,
          totalProcessedRecords: uploadedCount
        });
      })
      .on('error', (err) => {
        console.error('Error during CSV stream processing:', err);
        fs.unlinkSync(filePath); 
        res.status(500).send('Error processing the CSV file.');
      });
  } catch (err) {
    console.error('Unhandled error during CSV upload:', err);
    res.status(500).send('Internal server error during file upload.');
  }
};

module.exports = { uploadCsv };