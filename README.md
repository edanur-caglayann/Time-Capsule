Time Capsule Akıllı Kontratı
Bu proje, belirli bir süre boyunca varlıklarınızı güvenli bir şekilde saklayabilmenizi sağlayan bir zaman kapsülü akıllı kontratıdır. Kullanıcılar, fonlarını kilitleyerek, belirledikleri süre sonunda fonlarını çekebilirler. Bu akıllı kontrat, Solana ağı üzerinde Rust dili ile yazılmıştır.

Özellikler
Kullanıcı Hesabı Oluşturma: Kullanıcılar için hesaplar oluşturulabilir.
Kilitli Fon Hesabı Oluşturma: Her kullanıcı için fonlarını kilitleyebileceği bir kilitli fon hesabı oluşturulur.
Fon Transferi: Kullanıcılar, ana hesaplarından kilitli fon hesaplarına belirli miktarda SOL transfer edebilirler.
Fon Kilitleme: Transfer edilen fonlar, kullanıcının belirlediği süre boyunca kilitlenir.
Fon Çekme: Kullanıcılar, kilitli süre dolduğunda fonlarını kilitli fon hesaplarından çekebilirler. Süre dolmadan fon çekilmesine izin verilmez.
Fonksiyonlar
kullanici_olustur(): Yeni bir kullanıcı hesabı oluşturur.
kilitli_fon_cuzdab_hesabi_olustur(): Kullanıcı için bir kilitli fon hesabı oluşturur.
fon_transferi(miktar: bigint): Kullanıcıdan kilitli fon hesabına belirtilen miktarda fon transfer eder.
fon_cekme(): Kilit süresi dolduğunda fonların kilitli fon hesabından çekilmesini sağlar. Eğer süre dolmadıysa, fon çekme işlemi başarısız olur.
