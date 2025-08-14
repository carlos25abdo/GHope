// هذا السكربت جزء من حملة التبرع لغزة ويعكس الهوية الفلسطينية
// Google Apps Script لحذف المحلات من Google Sheets
// انسخ هذا الكود إلى https://script.google.com/

function doPost(e) {
  try {
    // الحصول على البيانات المرسلة
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const shopName = data.shopName;
    const sheetId = data.sheetId;
    
    if (action === 'delete' && shopName && sheetId) {
      // فتح الجدول
      const spreadsheet = SpreadsheetApp.openById(sheetId);
      const sheet = spreadsheet.getSheetByName('form 1'); // اسم الورقة
      
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Sheet not found'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // البحث عن الصف الذي يحتوي على اسم المحل
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      
      let rowToDelete = -1;
      
      // البحث في العمود الأول (اسم المحل)
      for (let i = 0; i < values.length; i++) {
        if (values[i][0] === shopName) {
          rowToDelete = i + 1; // +1 لأن الصفوف تبدأ من 1 في Google Sheets
          break;
        }
      }
      
      if (rowToDelete > 0) {
        // حذف الصف
        sheet.deleteRow(rowToDelete);
        
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          message: `تم حذف المحل "${shopName}" بنجاح`,
          deletedRow: rowToDelete
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'المحل غير موجود'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'بيانات غير صحيحة'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    message: 'Google Apps Script لحذف المحلات يعمل بنجاح',
    instructions: 'استخدم POST request مع البيانات المطلوبة'
  })).setMimeType(ContentService.MimeType.JSON);
}

// دالة مساعدة لحذف المحلات يدوياً
function deleteShopManually(shopName) {
  const sheetId = '1MUFoYd4Mc_GrrjCMAEMK-GlgVZL1dkMpxEz56Mf7rxE'; // استبدل بمعرف الجدول الخاص بك
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const sheet = spreadsheet.getSheetByName('form 1');
  
  if (!sheet) {
    console.log('Sheet not found');
    return false;
  }
  
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] === shopName) {
      sheet.deleteRow(i + 1);
      console.log(`تم حذف المحل "${shopName}" من الصف ${i + 1}`);
      return true;
    }
  }
  
  console.log(`المحل "${shopName}" غير موجود`);
  return false;
}
