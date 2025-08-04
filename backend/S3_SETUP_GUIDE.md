# S3 Bucket Setup Guide

This guide will help you fix the 403 Forbidden error when accessing profile photos from your S3 bucket.

## Problem
You're getting a 403 Forbidden error when trying to access profile photos from the S3 bucket. This is typically caused by:
1. Insufficient IAM permissions
2. Missing CORS configuration
3. Incorrect bucket policy
4. Wrong bucket region

## Solution Steps

### 1. Configure IAM Permissions

Create an IAM user with the following policy (or attach to existing user):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:GetObjectAcl",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:GetBucketPolicy",
        "s3:PutBucketPolicy",
        "s3:PutBucketCors"
      ],
      "Resource": [
        "arn:aws:s3:::unitynest",
        "arn:aws:s3:::unitynest/*"
      ]
    }
  ]
}
```

### 2. Set Environment Variables

Make sure these environment variables are set in your `.env` file:

```env
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-2
AWS_S3_BUCKET_NAME=unitynest
```

### 3. Configure S3 Bucket

Run the configuration script to set up CORS and bucket policy:

```bash
cd backend
node scripts/configureS3Bucket.js
```

This script will:
- Set up CORS configuration to allow web access
- Configure bucket policy for public read access
- Test the configuration

### 4. Manual AWS Console Configuration (Alternative)

If the script doesn't work, configure manually in AWS Console:

#### CORS Configuration
1. Go to S3 Console → Your Bucket → Permissions → CORS
2. Add this configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length"],
    "MaxAgeSeconds": 3000
  }
]
```

#### Bucket Policy
1. Go to S3 Console → Your Bucket → Permissions → Bucket Policy
2. Add this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::unitynest/*"
    }
  ]
}
```

### 5. Test Configuration

Use the debug endpoint to test your configuration:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/profile-photo/debug
```

### 6. Verify Bucket Region

Make sure your bucket region matches your AWS_REGION environment variable:
- Bucket: `unitynest` in `us-east-2`
- Environment: `AWS_REGION=us-east-2`

## Troubleshooting

### Check IAM Permissions
1. Verify your IAM user has the correct permissions
2. Check that the access key and secret are correct
3. Ensure the bucket name in the policy matches your actual bucket

### Check CORS
1. Verify CORS is configured in the S3 console
2. Check that your domain is in the AllowedOrigins (or use "*" for testing)

### Check Bucket Policy
1. Ensure the bucket policy allows public read access
2. Verify the bucket name in the policy matches your bucket

### Common Issues

1. **403 Forbidden**: Usually means IAM permissions or bucket policy issue
2. **CORS Error**: Check CORS configuration in S3 console
3. **Region Mismatch**: Ensure AWS_REGION matches your bucket region
4. **Invalid Access Key**: Verify your AWS credentials are correct

## Security Notes

- The bucket policy above allows public read access to all objects
- In production, consider restricting AllowedOrigins to your specific domain
- Consider using CloudFront for better performance and security
- Regularly rotate your AWS access keys

## Next Steps

After fixing the configuration:
1. Restart your backend server
2. Test uploading a new profile photo
3. Verify the photo displays correctly in the frontend
4. Monitor the debug endpoint for any remaining issues 