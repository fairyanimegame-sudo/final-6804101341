# บทบาทของ Driver

driverOpenInventory() ทำหน้าที่เป็น Driver ในการทดสอบ
เตรียมรูปแบบที่โมดูลระดับบนต้องการ แล้วเรียกโมดูลระดับล่างจริงโดยตรง
โดยไม่ต้องผ่าน Login

# ส่วนที่เป็น Real

ทำงานกับเว็บไซต์ SauceDemo จริง ไม่มีการ Stub หรือ Mock
เช่น หน้า inventory.html , cart.html , ปุ่ม add to cart
