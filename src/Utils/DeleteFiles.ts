import * as fs from 'fs';
import * as path from 'path';






export const CleanUpAfterUpload = (FileName:string) => {
    // Path to the file you want to delete
    const filePath = path.join(__dirname, '../Uploads', FileName);
    // Delete the file
    fs.unlink(filePath, (err) => {
        if (err) {
            return `Error deleting the file:${err}`
            console.error('', err);
        } else {
            return "File deleted successfully"
        }
    });

}