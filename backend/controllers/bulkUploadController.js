const { BulkUploadLog, User, FamilyMember, EducationDetail, EmploymentDetail, Skill, Job, JobApplication, Payment } = require('../models');
const { NotFoundError, ValidationError } = require('../middlewares/errorHandler');
const path = require('path');
const { parse } = require('csv-parse/sync');
const XLSX = require('xlsx');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt'); // Add bcrypt import

async function parseRecordsFromFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  let records = [];
  if (ext === '.csv') {
    const text = file.buffer.toString('utf8');
    records = csvParse(text, { columns: true, skip_empty_lines: true });
  } else if (ext === '.xlsx') {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    records = XLSX.utils.sheet_to_json(sheet);
  } else if (ext === '.json') {
    records = JSON.parse(file.buffer.toString('utf8'));
  }
  return records;
}

async function handleUserUpload(records) {
  let success = 0, failure = 0, skipped = 0, errors = [];
  for (const rec of records) {
    const { full_name, email, phone, password } = rec;
    if (!full_name || !email || !phone || !password) {
      failure++;
      errors.push({ email, phone, error: 'Missing required fields' });
      continue;
    }
    const exists = await User.findOne({ where: { [User.sequelize.Op.or]: [{ email }, { phone }] } });
    if (exists) {
      skipped++;
      errors.push({ email, phone, error: 'Duplicate (email/phone)' });
      continue;
    }
    try {
      await User.create({ full_name, email, phone, password_hash: password });
      success++;
    } catch (e) {
      failure++;
      errors.push({ email, phone, error: e.message });
    }
  }
  return { success, failure, skipped, errors };
}

async function handleFamilyUpload(records, adminId) {
  let success = 0, failure = 0, skipped = 0, errors = [];
  for (const rec of records) {
    const { user_id, name, relation, education, profession } = rec;
    if (!user_id || !name || !relation) {
      failure++;
      errors.push({ user_id, name, error: 'Missing required fields' });
      continue;
    }
    // Check for duplicate: same user_id + name + relation
    const exists = await FamilyMember.findOne({ where: { user_id, name, relation } });
    if (exists) {
      skipped++;
      errors.push({ user_id, name, error: 'Duplicate (user_id/name/relation)' });
      continue;
    }
    try {
      await FamilyMember.create({ user_id, name, relation, education, profession });
      success++;
    } catch (e) {
      failure++;
      errors.push({ user_id, name, error: e.message });
    }
  }
  return { success, failure, skipped, errors };
}

async function handleEducationUpload(records, adminId) {
  let success = 0, failure = 0, skipped = 0, errors = [];
  for (const rec of records) {
    const { user_id, degree, institution, year_of_passing, grade } = rec;
    if (!user_id || !degree || !institution || !year_of_passing) {
      failure++;
      errors.push({ user_id, degree, error: 'Missing required fields' });
      continue;
    }
    // Check for duplicate: same user_id + degree + institution + year_of_passing
    const exists = await EducationDetail.findOne({ where: { user_id, degree, institution, year_of_passing } });
    if (exists) {
      skipped++;
      errors.push({ user_id, degree, error: 'Duplicate (user_id/degree/institution/year)' });
      continue;
    }
    try {
      await EducationDetail.create({ user_id, degree, institution, year_of_passing, grade });
      success++;
    } catch (e) {
      failure++;
      errors.push({ user_id, degree, error: e.message });
    }
  }
  return { success, failure, skipped, errors };
}

async function handleEmploymentUpload(records, adminId) {
  let success = 0, failure = 0, skipped = 0, errors = [];
  for (const rec of records) {
    const { user_id, company_name, role, years_of_experience, currently_working } = rec;
    if (!user_id || !company_name || !role) {
      failure++;
      errors.push({ user_id, company_name, error: 'Missing required fields' });
      continue;
    }
    // Check for duplicate: same user_id + company_name + role
    const exists = await EmploymentDetail.findOne({ where: { user_id, company_name, role } });
    if (exists) {
      skipped++;
      errors.push({ user_id, company_name, error: 'Duplicate (user_id/company_name/role)' });
      continue;
    }
    try {
      await EmploymentDetail.create({ user_id, company_name, role, years_of_experience, currently_working });
      success++;
    } catch (e) {
      failure++;
      errors.push({ user_id, company_name, error: e.message });
    }
  }
  return { success, failure, skipped, errors };
}

async function handleSkillUpload(records, adminId) {
  let success = 0, failure = 0, skipped = 0, errors = [];
  for (const rec of records) {
    const { user_id, skill_name, endorsed_by } = rec;
    if (!user_id || !skill_name) {
      failure++;
      errors.push({ user_id, skill_name, error: 'Missing required fields' });
      continue;
    }
    // Check for duplicate: same user_id + skill_name
    const exists = await Skill.findOne({ where: { user_id, skill_name } });
    if (exists) {
      skipped++;
      errors.push({ user_id, skill_name, error: 'Duplicate (user_id/skill_name)' });
      continue;
    }
    try {
      await Skill.create({ user_id, skill_name, endorsed_by });
      success++;
    } catch (e) {
      failure++;
      errors.push({ user_id, skill_name, error: e.message });
    }
  }
  return { success, failure, skipped, errors };
}

async function handleJobUpload(records, adminId) {
  let success = 0, failure = 0, skipped = 0, errors = [];
  for (const rec of records) {
    const { posted_by, title, description, skills_required, job_type, salary_range, location, map_lat, map_lng } = rec;
    if (!title || !job_type) {
      failure++;
      errors.push({ title, error: 'Missing required fields' });
      continue;
    }
    // Check for duplicate: same title + posted_by + location
    const exists = await Job.findOne({ where: { title, posted_by, location } });
    if (exists) {
      skipped++;
      errors.push({ title, error: 'Duplicate (title/posted_by/location)' });
      continue;
    }
    try {
      await Job.create({ posted_by, title, description, skills_required, job_type, salary_range, location, map_lat, map_lng });
      success++;
    } catch (e) {
      failure++;
      errors.push({ title, error: e.message });
    }
  }
  return { success, failure, skipped, errors };
}

async function handleJobApplicationUpload(records, adminId) {
  let success = 0, failure = 0, skipped = 0, errors = [];
  for (const rec of records) {
    const { job_id, user_id, status } = rec;
    if (!job_id || !user_id) {
      failure++;
      errors.push({ job_id, user_id, error: 'Missing required fields' });
      continue;
    }
    // Check for duplicate: same job_id + user_id
    const exists = await JobApplication.findOne({ where: { job_id, user_id } });
    if (exists) {
      skipped++;
      errors.push({ job_id, user_id, error: 'Duplicate (job_id/user_id)' });
      continue;
    }
    try {
      await JobApplication.create({ job_id, user_id, status });
      success++;
    } catch (e) {
      failure++;
      errors.push({ job_id, user_id, error: e.message });
    }
  }
  return { success, failure, skipped, errors };
}

async function handlePaymentUpload(records, adminId) {
  let success = 0, failure = 0, skipped = 0, errors = [];
  for (const rec of records) {
    const { user_id, amount, payment_method, payment_status, transaction_id, payment_time } = rec;
    if (!user_id || !amount || !payment_method) {
      failure++;
      errors.push({ user_id, amount, error: 'Missing required fields' });
      continue;
    }
    // Check for duplicate: same user_id + transaction_id
    const exists = await Payment.findOne({ where: { user_id, transaction_id } });
    if (exists) {
      skipped++;
      errors.push({ user_id, transaction_id, error: 'Duplicate (user_id/transaction_id)' });
      continue;
    }
    try {
      await Payment.create({ user_id, amount, payment_method, payment_status, transaction_id, payment_time });
      success++;
    } catch (e) {
      failure++;
      errors.push({ user_id, transaction_id, error: e.message });
    }
  }
  return { success, failure, skipped, errors };
}

// Handler for combined user bulk upload (user, profile, education, employment, family)
exports.bulkUploadUsers = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (!['.csv', '.xlsx'].includes(ext)) return res.status(400).json({ error: 'Invalid file type' });

    // Parse records
    let records = [];
    if (ext === '.csv') {
      const text = req.file.buffer.toString('utf8');
      records = parse(text, { columns: true, skip_empty_lines: true });
    } else if (ext === '.xlsx') {
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      records = XLSX.utils.sheet_to_json(sheet);
    }

    let success = 0, failure = 0, errors = [];
    for (const rec of records) {
      // User fields
      const { full_name, email, phone, password, photo_url, dob, gender, village, mandal, district, pincode, caste, subcaste, marital_status, native_place } = rec;
      if (!full_name || !email || !phone || !password) {
        failure++;
        errors.push({ email, phone, error: 'Missing required user fields' });
        continue;
      }
      // Check for duplicate user
      const exists = await User.findOne({ where: { [Op.or]: [{ email }, { phone }] } });
      if (exists) {
        failure++;
        errors.push({ email, phone, error: 'Duplicate (email/phone)' });
        continue;
      }
      try {
        // Hash the password before creating user
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user
        const user = await User.create({
          full_name, email, phone, password_hash: hashedPassword, role: 'member', is_verified: true
        });
        // Create profile
        await user.createProfile({
          photo_url, dob, gender, village, mandal, district, pincode, caste, subcaste, marital_status, native_place
        });
        // Education details (up to 3)
        for (let i = 1; i <= 3; i++) {
          const degree = rec[`education_degree_${i}`];
          const institution = rec[`education_institution_${i}`];
          const year_of_passing = rec[`education_year_of_passing_${i}`];
          const grade = rec[`education_grade_${i}`];
          if (degree && institution && year_of_passing) {
            await user.createEducationDetail({ degree, institution, year_of_passing, grade });
          }
        }
        // Employment details (up to 3)
        for (let i = 1; i <= 3; i++) {
          const company_name = rec[`employment_company_name_${i}`];
          const role = rec[`employment_role_${i}`];
          const years_of_experience = rec[`employment_years_of_experience_${i}`];
          const currently_working = rec[`employment_currently_working_${i}`];
          if (company_name && role) {
            await user.createEmploymentDetail({ company_name, role, years_of_experience, currently_working: currently_working === 'true' || currently_working === true });
          }
        }
        // Family members (up to 3)
        for (let i = 1; i <= 3; i++) {
          const name = rec[`family_name_${i}`];
          const relation = rec[`family_relation_${i}`];
          const education = rec[`family_education_${i}`];
          const profession = rec[`family_profession_${i}`];
          if (name && relation) {
            await user.createFamilyMember({ name, relation, education, profession });
          }
        }
        success++;
      } catch (e) {
        failure++;
        errors.push({ email, phone, error: e.message });
      }
    }
    // Log the upload
    await BulkUploadLog.create({
      uploaded_by: req.user.id,
      filename: req.file.originalname,
      total_records: records.length,
      success_count: success,
      failure_count: failure
    });
    res.status(201).json({ message: 'Bulk user upload processed', success, failure, errors });
  } catch (err) { next(err); }
};

exports.uploadBulk = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (!['.csv', '.xlsx', '.json'].includes(ext)) return res.status(400).json({ error: 'Invalid file type' });
    const model = req.body.model || req.query.model;
    if (!['users', 'family_members', 'education_details', 'employment_details', 'skills', 'jobs', 'job_applications', 'payments'].includes(model)) {
      return res.status(400).json({ error: 'Invalid or missing model type' });
    }
    const records = await parseRecordsFromFile(req.file);
    let result;
    if (model === 'users') {
      result = await handleUserUpload(records);
    } else if (model === 'family_members') {
      result = await handleFamilyUpload(records, req.user.id);
    } else if (model === 'education_details') {
      result = await handleEducationUpload(records, req.user.id);
    } else if (model === 'employment_details') {
      result = await handleEmploymentUpload(records, req.user.id);
    } else if (model === 'skills') {
      result = await handleSkillUpload(records, req.user.id);
    } else if (model === 'jobs') {
      result = await handleJobUpload(records, req.user.id);
    } else if (model === 'job_applications') {
      result = await handleJobApplicationUpload(records, req.user.id);
    } else if (model === 'payments') {
      result = await handlePaymentUpload(records, req.user.id);
    }
    const log = await BulkUploadLog.create({
      uploaded_by: req.user.id,
      filename: req.file.originalname,
      total_records: records.length,
      success_count: result.success,
      failure_count: result.failure + result.skipped
    });
    res.status(201).json({ message: 'Bulk upload processed', log, ...result });
  } catch (err) { next(err); }
};

exports.listBulkLogs = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const logs = await BulkUploadLog.findAll({ order: [['upload_time', 'DESC']] });
    res.json(logs);
  } catch (err) { next(err); }
}; 