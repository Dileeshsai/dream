# S3 Profile Photo Access Fix Guide

## Problem
Profile photos are not accessible despite having S3 bucket access. The logs show 403 errors and presigned URL generation issues.

## Root Cause
The issue is likely caused by:
1. Insufficient IAM permissions for the AWS user
2. Missing or incorrect bucket policy
3. CORS configuration issues
4. Object existence checks failing due to permissions

## Solution Steps

### Step 1: Update IAM Permissions

1. Go to AWS Console → IAM → Users → Your User
2. Attach the policy from `required-iam-policy.json` or create a new policy with these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3BucketAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetBucketLocation",
        "s3:GetBucketPolicy",
        "s3:PutBucketPolicy",
        "s3:GetBucketCors",
        "s3:PutBucketCors",
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::unitynest"
    },
    {
      "Sid": "S3ObjectAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:GetObjectAcl",
        "s3:DeleteObject",
        "s3:HeadObject"
      ],
      "Resource": "arn:aws:s3:::unitynest/*"
    }
  ]
}
```

### Step 2: Run the S3 Fix Script

```bash
cd backend
node fix-s3-access.js
```

This script will:
- Test bucket access
- Configure CORS for web access
- Set up bucket policy for public read access
- Test presigned URL generation

### Step 3: Verify Environment Variables

Make sure your `.env` file has these variables:

```env
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-2
AWS_S3_BUCKET_NAME=unitynest
```

### Step 4: Restart Your Backend Server

```bash
# Stop your current server (Ctrl+C)
# Then restart it
npm start
# or
node app.js
```

### Step 5: Test Profile Photo Access

1. Try uploading a new profile photo
2. Check if existing profile photos load
3. Monitor the server logs for any remaining errors

## Troubleshooting

### If you still get 403 errors:

1. **Check IAM User Permissions**: Ensure your IAM user has the required permissions
2. **Verify Bucket Policy**: Make sure the bucket policy allows public read access
3. **Check CORS Configuration**: Ensure CORS is properly configured for your domain
4. **Test with AWS CLI**: Use AWS CLI to test direct bucket access

### AWS CLI Test Commands:

```bash
# Test bucket access
aws s3 ls s3://unitynest

# Test object access
aws s3 ls s3://unitynest/profile-photos/

# Test presigned URL generation
aws s3 presign s3://unitynest/profile-photos/user-16/1754201825005-fc4ec8e02c69aac8.jpg --expires-in 3600
```

### If the file doesn't exist:

The error might be because the specific profile photo file doesn't exist in S3. In this case:
1. Upload a new profile photo to test the system
2. Check the database to see what photo URLs are stored
3. Verify the S3 keys match what's in the database

## Expected Behavior After Fix

- Profile photos should load without 403 errors
- Presigned URLs should generate successfully
- Upload and download operations should work
- No more "Access Denied" errors in logs

## Monitoring

After applying the fix, monitor these logs:
- `Generating presigned URL:` - Should show successful generation
- `Presigned URL generated successfully:` - Should appear without errors
- No more 403 errors in the logs

If you continue to have issues, run the diagnostic script:
```bash
node diagnose-aws.js
``` 