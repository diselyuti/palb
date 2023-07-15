import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(); // Ініціалізуємо адміністративний SDK Firebase

export const setRole = functions.https.onCall(async (data, context) => {
  const { email, role } = data; // Отримуємо email користувача та обрану роль з запиту

  try {
    // Перевіряємо, чи користувач з правами адміністратора викликав цю функцію
    if (!context.auth || !context.auth.token.admin) {
      throw new functions.https.HttpsError('permission-denied', 'Only admins can call this function.');
    }

    // Отримуємо ідентифікатор користувача за допомогою email
    const user = await admin.auth().getUserByEmail(email);

    // Оновлюємо користувача з вибраною роллю
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: role === 'admin',
      moderator: role === 'moderator',
      viewer: role === 'viewer',
    });

    return { message: `Role ${role} has been set for user ${email}.` };
  } catch (error) {
    throw new functions.https.HttpsError('unknown', JSON.stringify(error));
  }
});
