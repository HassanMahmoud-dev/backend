import bcrypt from "bcryptjs";
import SystemUser from "@/models/system/systemUser.model";
import { getNextId } from "@/utils/ID";
import { closeOraclePool } from "@/config/database";
import "dotenv/config";

/**
 * سكريبت لإنشاء مستخدم بصلاحيات أدمن (admin)
 * يتم استخدامه لتجهيز النظام بالمستخدم الأول
 */
async function seedAdmin() {
  try {
    console.log("------------------------------------------");
    console.log("Starting Admin User Seeding Process...");
    console.log("------------------------------------------");

    // التحقق مما إذا كان المستخدم موجوداً مسبقاً
    const existingAdmin = await SystemUser.findOne({
      where: { USERNAME: "admin" },
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user 'admin' already exists. Skipping seeding.");
      return;
    }

    console.log("🔍 Generating next USER_ID...");
    const userId = await getNextId(SystemUser);

    console.log("🔑 Hashing password...");
    // يمكن تعيين كلمة المرور الافتراضية هنا أو عبر ملف .env
    const password = process.env.ADMIN_SEED_PASSWORD || "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("👤 Creating Admin user...");
    await SystemUser.create({
      USER_ID: userId,
      USERNAME: "admin",
      EMAIL: "admin@madar.com",
      PASSWORD: hashedPassword,
      FULL_NAME: "System Administrator",
      ROLE: "admin",
      IS_ACTIVE: "on",
    });

    console.log("✅ Admin user created successfully!");
    console.log(`   Username: admin`);
    console.log(`   Password: ${password}`);
    console.log("------------------------------------------");
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
  } finally {
    // إغلاق اتصال قاعدة البيانات للسماح للعملية بالانتهاء
    await closeOraclePool();
    process.exit(0);
  }
}

// تنفيذ السكريبت
seedAdmin();
