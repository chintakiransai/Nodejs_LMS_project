const AppError= require('../utils/appError.js')
const sendEmail = require('../utils/sendEmail.js')

const contactUs = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return next(new AppError('Name, Email, Message are required'));
    }

      const subject = 'Contact Us Form';
      const textMessage = `${name} - ${email} <br /> ${message}`;

      await sendEmail(email, subject, textMessage);

    res.status(200).json({
      success: true,
      message: 'Your request has been submitted successfully',
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, 400));
  }
};

module.exports = contactUs