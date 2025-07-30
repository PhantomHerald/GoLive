# AWS S3 Setup Guide for GoLive Video Upload

This guide will help you set up AWS S3 for video uploads in the GoLive application.

## Prerequisites

- AWS Account
- AWS CLI installed (optional but recommended)
- Spring Boot application running
- React Native Expo app

## Step 1: Create S3 Bucket

1. **Log into AWS Console**
   - Go to https://console.aws.amazon.com/
   - Navigate to S3 service

2. **Create a new bucket**
   - Click "Create bucket"
   - Choose a unique bucket name (e.g., `golive-videos-2024`)
   - Select your preferred region (e.g., `us-east-1`)
   - Keep default settings for now

3. **Configure bucket settings**
   - Go to your bucket → Properties
   - Enable "Block all public access" (we'll use presigned URLs)
   - Save changes

## Step 2: Create IAM User for Application Access

1. **Navigate to IAM**
   - Go to AWS Console → IAM
   - Click "Users" → "Create user"

2. **Create user**
   - Username: `golive-app-user`
   - Select "Programmatic access"
   - Click "Next"

3. **Attach policies**
   - Click "Attach existing policies directly"
   - Search for and select "AmazonS3FullAccess" (for development)
   - For production, create a custom policy with minimal permissions

4. **Complete user creation**
   - Add tags if needed
   - Review and create user
   - **IMPORTANT**: Download the CSV file with Access Key ID and Secret Access Key

## Step 3: Configure Spring Boot Application

1. **Update application.properties**
   ```properties
   # AWS S3 Configuration
   aws.access.key.id=YOUR_ACCESS_KEY_ID
   aws.secret.access.key=YOUR_SECRET_ACCESS_KEY
   aws.s3.region=us-east-1
   aws.s3.bucket.name=your-bucket-name
   ```

2. **Replace placeholder values**
   - `YOUR_ACCESS_KEY_ID`: From the CSV file downloaded
   - `YOUR_SECRET_ACCESS_KEY`: From the CSV file downloaded
   - `your-bucket-name`: Your actual S3 bucket name

## Step 4: Test the Setup

1. **Start the Spring Boot application**
   ```bash
   cd GoLiveBackend
   ./mvnw spring-boot:run
   ```

2. **Test upload endpoint**
   ```bash
   curl -X POST http://localhost:8080/api/upload/video \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -F "file=@test-video.mp4" \
     -F "title=Test Video" \
     -F "description=Test upload" \
     -F "category=Test"
   ```

3. **Test video listing endpoint**
   ```bash
   curl http://localhost:8080/api/upload/videos
   ```

## Step 5: Frontend Integration

The React Native app is already configured to work with the S3 backend:

1. **Upload flow**:
   - User taps "Upload" in Create tab
   - Selects video from device
   - Fills in title, description, category
   - Video uploads to S3 via Spring Boot
   - Success toast appears

2. **View videos**:
   - Navigate to Clips screen
   - Videos are fetched from S3
   - Presigned URLs are used for playback
   - Pull-to-refresh to update video list

## Security Best Practices

### For Development:
- Use the `AmazonS3FullAccess` policy
- Keep credentials in `application.properties`

### For Production:
1. **Create custom IAM policy**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:ListBucket",
           "s3:DeleteObject"
         ],
         "Resource": [
           "arn:aws:s3:::your-bucket-name",
           "arn:aws:s3:::your-bucket-name/*"
         ]
       }
     ]
   }
   ```

2. **Use environment variables**:
   ```properties
   aws.access.key.id=${AWS_ACCESS_KEY_ID}
   aws.secret.access.key=${AWS_SECRET_ACCESS_KEY}
   ```

3. **Consider using AWS Secrets Manager** for production credentials

## Troubleshooting

### Common Issues:

1. **"Access Denied" errors**
   - Check IAM user permissions
   - Verify bucket name in configuration
   - Ensure region matches bucket region

2. **"Invalid credentials"**
   - Verify Access Key ID and Secret Access Key
   - Check if credentials are expired
   - Ensure IAM user is active

3. **"Bucket not found"**
   - Verify bucket name spelling
   - Check if bucket exists in specified region
   - Ensure bucket is in the same region as your application

4. **"CORS errors" in frontend**
   - Configure CORS on S3 bucket:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

## File Size Limits

- **Default limit**: 100MB per video
- **To increase**: Update `spring.servlet.multipart.max-file-size` in `application.properties`
- **Recommended**: Implement chunked uploads for large files

## Cost Optimization

1. **Lifecycle policies**: Set up automatic deletion of old videos
2. **Storage classes**: Use S3 Standard-IA for infrequently accessed videos
3. **CDN**: Consider CloudFront for global video delivery
4. **Monitoring**: Set up CloudWatch alarms for costs

## Testing the Complete Flow

1. **Upload a video**:
   - Open the app
   - Go to Create tab
   - Tap "Upload"
   - Select a video file
   - Fill in metadata
   - Tap "Upload Video"
   - Verify success toast

2. **View uploaded videos**:
   - Navigate to Clips screen
   - Verify video appears in list
   - Test video playback
   - Test pull-to-refresh

3. **Verify S3 storage**:
   - Check AWS S3 console
   - Verify video files are uploaded to `videos/` folder
   - Check file permissions and metadata

## Next Steps

1. **Implement video processing**: Add video transcoding with AWS MediaConvert
2. **Add thumbnails**: Generate video thumbnails automatically
3. **Implement user-specific folders**: Organize videos by user ID
4. **Add video analytics**: Track views, likes, shares
5. **Implement video compression**: Optimize file sizes before upload

## Support

If you encounter issues:
1. Check AWS CloudTrail for API call logs
2. Review Spring Boot application logs
3. Verify network connectivity to AWS
4. Test with AWS CLI to isolate issues 