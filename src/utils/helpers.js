const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const { UserModal } = require("../modules/user/user-modal");
const { ClientUserModal } = require("../modules/client-user/clientUser-modal");
const { ClientModel } = require("../modules/client/client-model");
const {
  ServicePartnerModel,
} = require("../modules/service-partner/service-partner-model");
const { SupplierModal } = require("../modules/supplier/supplier-modal");
// const { google } = require("googleapis");

const models = [
  { name: "User", model: UserModal },
  { name: "Client User", model: ClientUserModal },
  { name: "Client", model: ClientModel },
  { name: "Service Partner", model: ServicePartnerModel },
  { name: "Supplier", model: SupplierModal },
];

// async function getNewAccessToken() {
//   const response = await fetch(
//     "https://login.microsoftonline.com/78952e5a-20eb-4219-8eb4-67e576246b2f/oauth2/v2.0/token",
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams({
//         client_id: "354c44f7-e19a-4a94-b744-54dc6b511453",
//         client_secret: "03h8Q~LVJMK3rCdrXAMBSMK8SXXjeBpQkrbpobXm",
//         grant_type: "refresh_token",
//         refresh_token:
//           "1.Ab4AWi6VeOsgGUKOtGfldiRrL_dETDWa4ZRKt0RU3GtRFFO-AF2-AA.AgABAwEAAABVrSpeuWamRam2jAF1XRQEAwDs_wUA9P-L12Pm9rNZgo2jv6V0ORdHUOeFQ-TXxVAX9EVGRVMATzW9OcZqwvPKz2LH0P--BpQ2HauhwcIJohOrzxdVu1j3tRjTXuCZn37FvF76nb8DlWK92KJHCJjtkw6omaNWNImJTidN6NWjy5Utq3qiyRpx6FQ0wSgoz7J4SN1OdTd5xyLyzjKZeXkWI-Qx-aGI5B-MalTjih_j0cTjkyU1TjAIkIodLiRrjqHkzdrRDU1lb8zBf1ngbX3dIPqGML-6-lrByvmAvkplRByCd-P-9Edp0tIKqGZPBJ9N8uQ16Fd2IswTMkwTjmzGcyBONQvl7InzSqUoQ2Nr5xyETrLDRCD05ePgOF63w06smhSGfM0UUO1xUiRo17oQAhoszvzYj_PQpmZeHjVV7GRXRwgmWMkOdnMR8uetapF_nT4zSKMKpZYru7eNOxyhs2WMfUkAU88kscYNBW0YEYWro2XPTdc170v_32OwPoK8EZ_nji43nUKR_HidNiAe3UzP-3sF-pC8XhtAEqqqYPViA3aq5-kg9Cvk2LuHyhLW01aX0mj_NdZR2IxjBPR41JzhaQvxa9tPCgE0OsbIIQNIwwmPAzPj3Wk_jom5KmuVwycxvRFuc9pPJIpewTvorsg09oWUNxZkrDITRlTtvovH0umS5Zex2sA97fJT8tYZt_BLIWWldu24STl9CmzJsNw7VqL2neDIEBxYVCbc8ApgxPFLPLJkM5J8j0q0RzXNWPn1K9clVnHHFW22bCLWqYizv1veyrs5s34XlZDpYH9o8lUlPGFceW_ng1bTj7FY3Gii1TLPHbODosFuUbH9oTD5wo0HwT2o_mwhuMcONE_-bABLM0QnFXNSlw_Vn5OOAz0I91jEOGB5",
//       }),
//     }
//   );
//   const data = await response.json();
//   console.log(data, "dataaaa");

//   return data.access_token;
// }

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
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
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
    // const oauth2Client = new google.auth.OAuth2(
    //   "354c44f7-e19a-4a94-b744-54dc6b511453",
    //   "03h8Q~LVJMK3rCdrXAMBSMK8SXXjeBpQkrbpobXm",
    //   "https://login.microsoftonline.com/78952e5a-20eb-4219-8eb4-67e576246b2f/oauth2/v2.0/token"
    // );

    // oauth2Client.setCredentials({
    //   refresh_token: "1.Ab4AWi6VeOsgGUKOtGfldiRrL_dETDWa4ZRKt0RU3GtRFFO-APy-AA.AgABAwEAAABVrSpeuWamRam2jAF1XRQEAwDs_wUA9P-Gw-Xa8pLeNdGQlz93OmGMsr6lyAFWm7MZYuzkrNFPeQZzp-TZ8vz4E65L8jb-I0RJkXtbwLNe_uCrk1hV5ThmVh5TjVOzfDrb0M0Ug0LOqGCvd6yKAXeYE4-IBp_w3Pf31hVSK81XKZvjTisHn2GdB_z0iJk1vTXBkECsNNC3C3ZbCUnmuAuyd1z8PsCHfxCSAwYAH8XKcDVznH-5ZvaSkrMZ1vn35jyAp734AiHfKYZ-fTZl5Jw_4ZvS51LKEinTrulYr-NkNnkD64xJz82AZVjnhqHV2RahFukY5U1CxNN4VgHkZg-skXeZev_oNLsbamlG2gs5X4BnrWoSbDev88DG_YDkR-MeyOEoV4Kefpbnx-LzcLjOUDK2U2qQuY9zdrUf_rroePkCzOxACMt5n8EbMykUZzj0bPkIhOcJEyB4yE2iI9g324k73GFGSK3-MPgTDTfmE_P0I70oDnt6pbtsOPyFwe2dFfO9C4amJciMUHHEmI5t9Aribu2zjQ6ATHiwKBQ5tNzDXL1RRTJKGoTxc0O6DMTyL_SZ6v3IYG-Y4ZQCSpta-QiCzY2kqCYoDnBapuPhbbMOktIJh50EbMs6mQiHpBKpfP3WSEdCfCTMcz902ywAIsLnWLrCxDcVoNJ8SEC353K655lq-UyF3u_tMl4rhqOWI1fvwAvghbVAqDPakd9AR88JDi_QFSKYhtrJT3KW5GE7slvzZVqBOKFUWa5DaxJzHd5VYbBnGxoFvq3Xhy5hMcnCc4FxmtohUZEh7iminbDnuSGGktiWiaX4Uo3L25ZNYXGDArVi1BotKDB4wi_DPpHV2aUiB7a816feCXzmbLalHpVuHskF3JmnJX0oPMV90AyjIwj0dXOo7tmrFpb1HRXKXqHmnZNI8DkV1NnO0kl0w1ns7mGE_gLNM3zGBV2mGRpPs4B7Izn28hLo3qiMOo4",
    // });

    // const transporter = nodemailer.createTransport({
    //   host: "email-smtp.ap-south-1.amazonaws.com", // Explicitly define host
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: "AKIA5JMSUGZGOFYQ2RER",
    //     pass: "BCn6O28MKTKJ7mg0EBYCyaoIOOj9lX3sD1xlUqJm9yT5", // ⚠️ Store this securely (Use environment variables)
    //   },
    // });

    // let mailOptions = {
    //   from: "Support@matrixonline.in",
    //   to: recipientEmail,
    //   cc: ccEmails,
    //   subject: subject,
    //   text: body,
    // };

    // const accessToken = await getNewAccessToken();
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.office365.com",
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     type: "OAuth2",
    //     user: "support@matrixonline.in",
    //     clientId: "354c44f7-e19a-4a94-b744-54dc6b511453",
    //     clientSecret: "03h8Q~LVJMK3rCdrXAMBSMK8SXXjeBpQkrbpobXm",
    //     refreshToken:
    //       "1.Ab4AWi6VeOsgGUKOtGfldiRrL_dETDWa4ZRKt0RU3GtRFFO-AF2-AA.AgABAwEAAABVrSpeuWamRam2jAF1XRQEAwDs_wUA9P-L12Pm9rNZgo2jv6V0ORdHUOeFQ-TXxVAX9EVGRVMATzW9OcZqwvPKz2LH0P--BpQ2HauhwcIJohOrzxdVu1j3tRjTXuCZn37FvF76nb8DlWK92KJHCJjtkw6omaNWNImJTidN6NWjy5Utq3qiyRpx6FQ0wSgoz7J4SN1OdTd5xyLyzjKZeXkWI-Qx-aGI5B-MalTjih_j0cTjkyU1TjAIkIodLiRrjqHkzdrRDU1lb8zBf1ngbX3dIPqGML-6-lrByvmAvkplRByCd-P-9Edp0tIKqGZPBJ9N8uQ16Fd2IswTMkwTjmzGcyBONQvl7InzSqUoQ2Nr5xyETrLDRCD05ePgOF63w06smhSGfM0UUO1xUiRo17oQAhoszvzYj_PQpmZeHjVV7GRXRwgmWMkOdnMR8uetapF_nT4zSKMKpZYru7eNOxyhs2WMfUkAU88kscYNBW0YEYWro2XPTdc170v_32OwPoK8EZ_nji43nUKR_HidNiAe3UzP-3sF-pC8XhtAEqqqYPViA3aq5-kg9Cvk2LuHyhLW01aX0mj_NdZR2IxjBPR41JzhaQvxa9tPCgE0OsbIIQNIwwmPAzPj3Wk_jom5KmuVwycxvRFuc9pPJIpewTvorsg09oWUNxZkrDITRlTtvovH0umS5Zex2sA97fJT8tYZt_BLIWWldu24STl9CmzJsNw7VqL2neDIEBxYVCbc8ApgxPFLPLJkM5J8j0q0RzXNWPn1K9clVnHHFW22bCLWqYizv1veyrs5s34XlZDpYH9o8lUlPGFceW_ng1bTj7FY3Gii1TLPHbODosFuUbH9oTD5wo0HwT2o_mwhuMcONE_-bABLM0QnFXNSlw_Vn5OOAz0I91jEOGB5",
    //     accessToken,
    //   },
    // });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "phonologixdeveloper@gmail.com",
        pass: "qltfqjevclinudxs",
      },
    });

    var mailOptions = {
      // from: "support",
      from: "support@matrixonline.in",
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
