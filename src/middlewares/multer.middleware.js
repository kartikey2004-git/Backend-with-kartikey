import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },

  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname);

    // but ye achi practice nhi hai kyuki same name ki kayi files aajayein toh wo overwrite ho jayengi

    // but operation is for tiny amount of time on server pe , thodi der ke liye rhegi wo file and then phir hum usko cloudinary pe upload krdenge

    // we can minor functionality later

    // cb se humein return mein filename meil jayega , toh localpath wali kahani humari yaha se solve hojati hai , localpath humare pass aa jayega
  },
});

export const upload = multer({
  storage,
});

// cb parameters padh skte h , agar humein filename change krna hai unique rkhna hai

// har ek filename kis tarike se rkhna h woh humare upar h isko aur advanced kiya jaa skta hai

// isko aur advanced kiya ja skta hai , hum kayi baar dekhenge file ka name unique id se rkha jata h , nano id ( numbers , character ke string ) se rkha jata hai

// unique suffix ::

// const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) like this
