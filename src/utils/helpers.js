const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const { UserModal } = require("../modules/user/user-modal");
const { ClientUserModal } = require("../modules/client-user/clientUser-modal");
const { ClientModel } = require("../modules/client/client-model");
const {
  ServicePartnerModel,
} = require("../modules/service-partner/service-partner-model");
const { SupplierModal } = require("../modules/supplier/supplier-modal");

const models = [
  { name: "User", model: UserModal },
  { name: "Client User", model: ClientUserModal },
  { name: "Client", model: ClientModel },
  { name: "Service Partner", model: ServicePartnerModel },
  { name: "Supplier", model: SupplierModal },
];

async function checkIfNumberEmailUnique(mobile, email, _id = null) {
  if (!mobile && !email) {
    throw new Error("At least one of mobile or email is required");
  }

  let results = [];
  let messages = [];

  // Iterate through each model and perform independent queries.
  for (const { name, model } of models) {
    // Query separately for mobile and email
    const mobileRecord = mobile ? await model.findOne({ mobile }) : null;
    const emailRecord = email ? await model.findOne({ email }) : null;

    // Check for conflict based on _id (if provided)
    const isMobileConflict =
      mobileRecord && (!_id || mobileRecord._id.toString() !== _id.toString());
    const isEmailConflict =
      emailRecord && (!_id || emailRecord._id.toString() !== _id.toString());

    if (isMobileConflict || isEmailConflict) {
      // If both exist and are from the same document, combine the message.
      if (
        isMobileConflict &&
        isEmailConflict &&
        mobileRecord._id.toString() === emailRecord._id.toString()
      ) {
        results.push({
          model: name,
          data: mobileRecord.toObject(),
        });
        messages.push(`A ${name} is created with this mobile number and email`);
      } else {
        // If mobile conflict exists separately:
        if (isMobileConflict) {
          results.push({
            model: name,
            data: mobileRecord.toObject(),
          });
          messages.push(`A ${name} is created with this mobile number`);
        }
        // If email conflict exists separately:
        if (isEmailConflict) {
          // Avoid pushing duplicate record if it was already added from mobileRecord.
          if (
            !isMobileConflict ||
            (mobileRecord &&
              emailRecord &&
              mobileRecord._id.toString() !== emailRecord._id.toString())
          ) {
            results.push({
              model: name,
              data: emailRecord.toObject(),
            });
          }
          messages.push(`A ${name} is created with this email`);
        }
      }
    }
  }

  if (results.length > 0) {
    return { error: messages.join(" | "), details: results };
  }

  return {
    success: true,
    message: "Mobile and Email are unique or valid for update",
  };
}

function generateRequestNumber(prefix, clientName) {
  if (!clientName.trim()) {
    throw new Error("Client name cannot be empty");
  }

  const firstWord = clientName.split(" ")[0]; // Get the first word of the client name
  const randomDigits = Math.floor(Math.random() * 9000) + 1000; // Generate a random 4-digit number

  return `${prefix}-${firstWord.toUpperCase()}-${randomDigits}`;
}

const generatePDF = async (htmlContent) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set content
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  // Delay to ensure styles are applied
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

  await browser.close();
  return pdfBuffer;
};

// Function to send email with PDF attachment
const sendEmail = async ({
  subject,
  body,
  recipientEmail,
  pdfBuffer,
  ccEmails = [],
}) => {
  try {
    // const transporter = nodemailer.createTransport({
    //   host: "outlook.office365.com", // Explicitly define host
    //   port: 587, // Office365 SMTP port
    //   secure: false, // Set false because TLS is used
    //   auth: {
    //     user: "Support@matrixonline.in",
    //     pass: "cling@2005", // ⚠️ Store this securely (Use environment variables)
    //   },
    //   tls: {
    //     ciphers: "SSLv3",
    //   },
    // });

    // let mailOptions = {
    //   from: "Support@matrixonline.in",
    //   to: recipientEmail,
    //   cc: ccEmails,
    //   subject: subject,
    //   text: body,
    // };

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "phonologixdeveloper@gmail.com",
        pass: "qltfqjevclinudxs",
      },
    });

    var mailOptions = {
      from: "phonologixdeveloper@gmail.com",
      to: recipientEmail,
      cc: ccEmails,
      subject,
      text: body,
    };

    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: "quotation.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ];
    }

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (err) {
    console.log("Error sending email:", err);
  }
};

module.exports = {
  generateRequestNumber,
  generatePDF,
  sendEmail,
  checkIfNumberEmailUnique,
};
