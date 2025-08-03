const express = require('express');
const router = express.Router();
const profilePhotoController = require('../controllers/profilePhotoController');
const { authenticateJWT } = require('../middlewares/auth');
const profilePhotoUpload = require('../middlewares/profilePhotoUpload');

/**
 * @swagger
 * /api/profile-photo/upload:
 *   post:
 *     summary: Upload a new profile photo
 *     tags: [Profile Photo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Profile photo file (JPEG, PNG, GIF, WebP, max 5MB)
 *     responses:
 *       200:
 *         description: Profile photo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     photoUrl:
 *                       type: string
 *                     fileName:
 *                       type: string
 *                     profile:
 *                       type: object
 *       400:
 *         description: Invalid file or validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/upload', 
  authenticateJWT, 
  profilePhotoUpload.single('photo'), 
  profilePhotoController.uploadProfilePhoto
);

/**
 * @swagger
 * /api/profile-photo/update:
 *   put:
 *     summary: Update an existing profile photo
 *     tags: [Profile Photo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: New profile photo file (JPEG, PNG, GIF, WebP, max 5MB)
 *     responses:
 *       200:
 *         description: Profile photo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     photoUrl:
 *                       type: string
 *                     fileName:
 *                       type: string
 *                     profile:
 *                       type: object
 *       400:
 *         description: Invalid file or validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
router.put('/update', 
  authenticateJWT, 
  profilePhotoUpload.single('photo'), 
  profilePhotoController.updateProfilePhoto
);

/**
 * @swagger
 * /api/profile-photo/delete:
 *   delete:
 *     summary: Delete profile photo
 *     tags: [Profile Photo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile photo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     profile:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No profile photo found
 *       500:
 *         description: Server error
 */
router.delete('/delete', 
  authenticateJWT, 
  profilePhotoController.deleteProfilePhoto
);

/**
 * @swagger
 * /api/profile-photo:
 *   get:
 *     summary: Get profile photo URL
 *     tags: [Profile Photo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile photo URL retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     photoUrl:
 *                       type: string
 *                       nullable: true
 *                     hasPhoto:
 *                       type: boolean
 *                     profile:
 *                       type: object
 *                       nullable: true
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', 
  authenticateJWT, 
  profilePhotoController.getProfilePhoto
);

/**
 * @swagger
 * /api/profile-photo/fix:
 *   post:
 *     summary: Fix profile photo URL if it's stored as presigned URL
 *     tags: [Profile Photo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile photo URL fixed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     photoUrl:
 *                       type: string
 *                       nullable: true
 *                     hasPhoto:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/fix', 
  authenticateJWT, 
  profilePhotoController.fixProfilePhotoUrl
);

/**
 * @swagger
 * /api/profile-photo/presigned:
 *   get:
 *     summary: Get presigned URL for private photo access
 *     tags: [Profile Photo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: expiresIn
 *         schema:
 *           type: integer
 *           default: 3600
 *         description: Expiration time in seconds (default 1 hour)
 *     responses:
 *       200:
 *         description: Presigned URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     presignedUrl:
 *                       type: string
 *                     expiresIn:
 *                       type: integer
 *                     originalUrl:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No profile photo found
 *       500:
 *         description: Server error
 */
router.get('/presigned', 
  authenticateJWT, 
  profilePhotoController.getPresignedUrl
);

/**
 * @swagger
 * /api/profile-photo/refresh-url:
 *   post:
 *     summary: Refresh presigned URL for profile photo
 *     tags: [Profile Photo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expiresIn:
 *                 type: integer
 *                 default: 3600
 *                 description: Expiration time in seconds (default 1 hour)
 *     responses:
 *       200:
 *         description: Profile photo URL refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     photoUrl:
 *                       type: string
 *                     expiresIn:
 *                       type: integer
 *                     profile:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No profile photo found
 *       500:
 *         description: Server error
 */
router.post('/refresh-url', 
  authenticateJWT, 
  profilePhotoController.refreshPhotoUrl
);

module.exports = router; 