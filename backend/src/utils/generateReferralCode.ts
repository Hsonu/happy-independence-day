import User from '../models/User';

const generateReferralCode = async (username: string): Promise<string> => {
  let code: string;
  let exists = true;

  do {
    const randomNum = Math.floor(10 + Math.random() * 90); // 10–99
    code = `${username.toUpperCase()}${randomNum}`;
    const existingUser = await User.findOne({ referralCode: code });
    exists = !!existingUser;
  } while (exists);

  return code;
};

export default generateReferralCode;
