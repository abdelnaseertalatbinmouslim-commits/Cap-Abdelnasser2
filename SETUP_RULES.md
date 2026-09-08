# Firebase Setup

## Admin
1. Firebase Console → Authentication → Sign-in method → Email/Password → Enable.
2. Create the Primary and Backup admin users.
3. Copy each UID.
4. In Realtime Database create:
```text
adminUsers
  UID_PRIMARY
    role: primary
  UID_BACKUP
    role: backup
```
5. Do not publish admin passwords in source code.

## Telegram Secrets
Configure Functions secrets named exactly:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

The client never receives the bot token.

## Existing database
The current project expects the existing nodes `students`, `notifications`, `quiz_results`, `quizzes`, plus new `content` and `adminUsers`. Existing exported records should be backed up before changing rules.

## Important
If your old rules currently allow public reads of `students`, replace them only after testing in a backup/project copy. The new rules intentionally prevent students from reading other students' records.
