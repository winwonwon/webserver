DROP DATABASE IF EXISTS sec3_gr8_database;
CREATE DATABASE IF NOT EXISTS `sec3_gr8_database` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `sec3_gr8_database`;

-- DDL --

DROP TABLE IF EXISTS `Admins`;
CREATE TABLE `Admins` (
  `Admin_ID` CHAR(4) NOT NULL,
  `Admin_FirstName` VARCHAR(30) NOT NULL,
  `Admin_LastName` VARCHAR(30) NOT NULL,
  CONSTRAINT PK_AdminID PRIMARY KEY (Admin_ID)
);


DROP TABLE IF EXISTS `Accounts`;
CREATE TABLE `Accounts` (
  `Account_ID` CHAR(6) NOT NULL,
  `Account_FirstName` VARCHAR(30) NOT NULL,
  `Account_LastName` VARCHAR(30) NOT NULL,
  `Account_Mail` VARCHAR(30) NOT NULL UNIQUE,
  `Account_Tel` VARCHAR(11),
  `Account_Password` CHAR(60) NOT NULL, -- Hashed password using a secure algorithm change from 30 -. 60
  CONSTRAINT PK_AccountID PRIMARY KEY (Account_ID)
);


DROP TABLE IF EXISTS `Manages`; -- Admin manages Accounts
CREATE TABLE `Manages` (
  `Admin_ID` CHAR(4) NOT NULL,
  `Account_ID` CHAR(6) NOT NULL,
  `Admin_Account_ID` INT PRIMARY KEY AUTO_INCREMENT, -- is added
  CONSTRAINT FK_AccountID FOREIGN KEY (Account_ID) 
  REFERENCES Accounts(Account_ID),
  CONSTRAINT FK_AdminAc FOREIGN KEY (Admin_ID)
  REFERENCES Admins(Admin_ID)
);


DROP TABLE IF EXISTS `Tutor_Accounts`;
CREATE TABLE `Tutor_Accounts` (
  `Tutor_ID` CHAR(8) NOT NULL,
  `Admin_ID` CHAR(4) NOT NULL,
  `Account_ID` CHAR(6) NOT NULL,
  CONSTRAINT FK_Admintut FOREIGN KEY (Admin_ID) 
  REFERENCES Admins(Admin_ID),
  CONSTRAINT FK_Accounttut FOREIGN KEY (Account_ID) 
  REFERENCES Accounts(Account_ID),
  CONSTRAINT PK_TutorID PRIMARY KEY (Tutor_ID)
);


DROP TABLE IF EXISTS `Subjects`;
CREATE TABLE `Subjects` (
  `Subject_ID` CHAR(8) NOT NULL,
  `Subject_Name` VARCHAR(30) NOT NULL,
  CONSTRAINT PK_SubjectID PRIMARY KEY (Subject_ID)
);


DROP TABLE IF EXISTS `Teaches`; -- Tutor teaches Subjects
CREATE TABLE `Teaches` (
  `Tutor_ID` CHAR(8) NOT NULL,
  `Subject_ID` CHAR(6) NOT NULL,
  CONSTRAINT FK_Tutorsub FOREIGN KEY (Tutor_ID) 
  REFERENCES Tutor_Accounts(Tutor_ID),
  CONSTRAINT FK_Sujecttut FOREIGN KEY (Subject_ID) 
  REFERENCES Subjects(Subject_ID)
);


DROP TABLE IF EXISTS `Student_Accounts`;
CREATE TABLE `Student_Accounts` (
  `Student_ID` CHAR(6) NOT NULL,
  `Subject_ID` CHAR(6) NOT NULL,
  `Account_ID` CHAR(6) NOT NULL,
  CONSTRAINT FK_Accountstu FOREIGN KEY (Account_ID) 
  REFERENCES Accounts(Account_ID),
  CONSTRAINT FK_SubjectID FOREIGN KEY (Subject_ID) 
  REFERENCES Subjects(Subject_ID),
  CONSTRAINT PK_StudentID PRIMARY KEY (Student_ID)
);


DROP TABLE IF EXISTS `Matches`; -- Tutors matches with Student
CREATE TABLE `Matches` (
	`Tutor_ID` CHAR(8) NOT NULL,
	`Student_ID` CHAR(6) NOT NULL,
    CONSTRAINT FK_matchTutor FOREIGN KEY (Tutor_ID)
    REFERENCES Tutor_Accounts(Tutor_ID),
    CONSTRAINT FK_matchStudent FOREIGN KEY (Student_ID)
    REFERENCES Student_Accounts(Student_ID)
);


DROP TABLE IF EXISTS `Reviews`;
CREATE TABLE `Reviews` (
  `Review_ID` CHAR(5) NOT NULL,
  `Review_Msg` VARCHAR(50) NOT NULL,
  `Review_Date` DATE NOT NULL,
  `Review_Rating` INT NOT NULL,
  `Tutor_ID` CHAR(8) NOT NULL,
  `Student_ID` CHAR(6) NOT NULL,
  CONSTRAINT FK_reviewTutor FOREIGN KEY (Tutor_ID)
  REFERENCES Tutor_Accounts(Tutor_ID),
  CONSTRAINT FK_reviewStudent FOREIGN KEY (Student_ID)
  REFERENCES Student_Accounts(Student_ID),
  CONSTRAINT PK_ReviewID PRIMARY KEY (Review_ID)
);


DROP TABLE IF EXISTS `Applies_for`; -- Student applies for Subjects
CREATE TABLE `Applies_for`(
`Student_ID` CHAR(6) NOT NULL,
`Subject_ID` CHAR(6) NOT NULL,
CONSTRAINT FK_StudentSub FOREIGN KEY (Student_ID)
REFERENCES Student_Accounts(Student_ID),
CONSTRAINT FK_SubjectStu FOREIGN KEY (Subject_ID)
REFERENCES Subjects(Subject_ID)
);


-- DML --

-- SET SQL_SAFE_UPDATES = 0;

INSERT INTO Admins (`Admin_ID`, `Admin_FirstName`, `Admin_Lastname`)
VALUES 
	 -- admin(0)
    ('Ad01', 'Krit', 'Amnuaydechkorn'),
    ('Ad02', 'Putthipong', 'Assaratanakul'),
    ('Ad03', 'Thanapob', 'Leeratanakajorn'),
    ('Ad04', 'Kritsanapoom', 'Pibulsonggram'),
    ('Ad05', 'Chutavuth', 'Pattarakampol'),
    ('Ad06', 'Naphat', 'Siangsomboon'),
    ('Ad07', 'Kemisara', 'Paladesh'),
    ('Ad08', 'Supassara', 'Thanachart'),
    ('Ad09', 'Pimchanok', 'Luevisadpaibul'),
    ('Ad10', 'Kanyawee', 'Songmuang');
SELECT * 
FROM Admins;


INSERT INTO Accounts (`Account_ID`, `Account_FirstName`, `Account_LastName`, `Account_Mail`, `Account_Tel`, `Account_Password`)
VALUES 
	 -- Admin
	('ACC001', 'Krit', 'Amnuaydechkorn', 'krit.amn@example.com','0640706717', 'ppkritt'),
    ('ACC002', 'Putthipong', 'Assaratanakul','putthipong.ass@example.com', '094412060', 'billkinloveyou'),
    ('ACC003', 'Thanapob', 'Leeratanakajorn','thanapob.lee@example.com', '0805952200', 'torthanapoblee37'),
    ('ACC004', 'Kritsanapoom', 'Pibulsonggram','kristsanapoom.pib@example.com', '0896679496', 'jaylerr36cnx'),
    ('ACC005', 'Chutavuth', 'Pattarakampol','chutivuth.patt@example.com', '0621841264', 'marchchu157'),
    ('ACC006', 'Naphat', 'Siangsomboon','naphat.sia@example.com', '0645682716', 'nine99'),
    ('ACC007', 'Kemisara', 'Paladesh','kemisara.pal@example.com','0824481548', 'belle456'),
    ('ACC008', 'Supassara', 'Thanachart', 'supassara.tha@example.com','0891037923', 'gaosupas9'),
    ('ACC009', 'Pimchanok', 'Luevisadpaibul','pimchanok.lue@example.com', '0820214927', 'baifernbah'),
    ('ACC010', 'Kanyawee', 'Songmuang','kanyawee.son@example.com', '0618982075', 'thanaerngnin'),
    
	--  -- Student
--     ('ACC011', 'Thanakrit', 'Yingwattanakul', 'thanakrit.yin@example.com', '0850706717', 'mindice0710'),
--     ('ACC012', 'Alexander', 'Buckland', 'alexander.buc@example.com', '065412060', 'alexdice2403'),
--     ('ACC013', 'Kansopon', 'Wirunnithiphon', 'kansopon.wir@example.com', '0915952200', 'jaydice2304'),
--     ('ACC014', 'Wachirakon', 'Raksasuwan', 'wachirakorn.rak@example.com', '0906679496', 'apodice1805'),
--     ('ACC015', 'Akira', 'Kim', 'akira.kim@example.com', '0831841264', 'jisangdice0305'),
--     ('ACC016', 'Aphinat', 'Piamkunvanich', 'aphinat.pia@example.com', '0665682716', 'obodice1705'),
--     ('ACC017', 'Chayapol', 'Khieoiem', 'chayapol.khi@example.com', '0934481548', 'cheesedice1506'),
--     ('ACC018', 'Maddoc', 'Davies', 'maddoc.dav@example.com', '0901037923', 'maddocdice2806'),
--     ('ACC019', 'Sippavitch', 'Pongwachirint', 'sippavitch.pon@example.com', '0930214927', 'ottodice2107'),
--     ('ACC020', 'Tanannat', 'Sittipanku', 'tanannat.sit@example.com', '0828982075', 'framedice2108'),
    
    -- Tutor
    ('ACC021', 'Chanisara', 'Jonsomjid', 'chanisara.jon@example.com', '0940706717', 'lalanuey033'),
    ('ACC022', 'Thareerat', 'Phothithum', 'thareerat.pho@example.com', '0995412060', 'villtha071'),
    ('ACC023', 'Phanphum ', 'Prathumsuwan', 'phanphum.pra@example.com', '0805952200', 'withphanphum081'),
    ('ACC024', 'Pran ', 'Tantipiwatanaskul', 'pran.tan@example.com', '0896679496', 'pprannn105'),
    ('ACC025', 'Paranee ', 'Wannasorn', 'paranee.wan@example.com', '0621841264', '6uidorwns201'),
    ('ACC026', 'Achiraya', 'Mankham', 'achiraya.man@example.com', '0955682716', 'achiploy183'),
    ('ACC027', 'Panipak', 'sittipasert', 'panipak.sit@example.com', '0824481548', 'pnpearn096'),
    ('ACC028', 'Yaowapa', 'Sabkasedkid', 'yaowapa.sub@example.com', '0891037923', 'preeamm087'),
    ('ACC029', 'Kawin', 'Surakupt', 'kawin.sur@example.com', '0820214927', 'kawinsurakupt101'),
    ('ACC030', 'Emma', 'Watson', 'emma.wat@example.com', '0618982075', 'emmanct127');
SELECT * 
FROM Accounts;


INSERT INTO Manages (`Admin_ID`,`Account_ID`)
VALUES
-- Admin
('Ad01', 'ACC001'),
('Ad02', 'ACC002'),
('Ad03', 'ACC003'),
('Ad04', 'ACC004'),
('Ad05', 'ACC005'),
('Ad06', 'ACC006'),
('Ad07', 'ACC007'),
('Ad08', 'ACC008'),
('Ad09', 'ACC009'),
('Ad10', 'ACC010');
SELECT *
FROM Manages;


INSERT INTO Tutor_Accounts (`Tutor_ID`,`Admin_ID`,`Account_ID`) -- add account Id
VALUES 
	('Tutor001','Ad01','ACC001'),
    ('Tutor002','Ad02','ACC002'),
    ('Tutor003','Ad03','ACC003'),
    ('Tutor004','Ad04','ACC004'),
    ('Tutor005','Ad05','ACC005'),
    ('Tutor006','Ad06','ACC006'),
    ('Tutor007','Ad07','ACC007'),
    ('Tutor008','Ad08','ACC008'),
    ('Tutor009','Ad09','ACC009'),
    ('Tutor010','Ad10','ACC010');
SELECT * 
FROM Tutor_Accounts;


INSERT INTO Subjects (`Subject_ID`, `Subject_Name`)
VALUES 
    ('Sub001', 'English'),
    ('Sub002', 'Math'),
    ('Sub003', 'Science'),
    ('Sub004', 'Social studies'),
    ('Sub005', 'Chinese'),
    ('Sub006', 'Korean'),
    ('Sub007', 'Japanese'),
    ('Sub008', 'Information technology'),
    ('Sub009', 'Art'),
    ('Sub010', 'History'),
    ('Sub030', 'General Biology'),
    ('Sub031', 'Human Biology'),
    ('Sub032', 'Anatomy'),
    ('Sub033', 'AP Biology'),
    ('Sub034', 'Physiology'),
    ('Sub050', 'Software Engineer'),
    ('Sub051', 'Data Structure'),
    ('Sub052', 'Cyber Security'),
    ('Sub053', 'Networking'),
    ('Sub054', 'Artificial intelligence');
    
SELECT * 
FROM Subjects;


INSERT INTO Teaches (`Tutor_ID`,`Subject_ID`)
VALUES 
	('Tutor001','Sub001'),
    ('Tutor002','Sub002'),
    ('Tutor003','Sub003'),
    ('Tutor004','Sub004'),
    ('Tutor005','Sub005'),
    ('Tutor006','Sub006'),
    ('Tutor007','Sub007'),
    ('Tutor008','Sub008'),
    ('Tutor009','Sub009'),
    ('Tutor010','Sub010');
SELECT * 
FROM Teaches;


INSERT INTO Student_Accounts (`Student_ID`,`Subject_ID`,`Account_ID`) -- add account Id
VALUES 
	('Stu001','Sub001','ACC001'),
    ('Stu002','Sub002','ACC002'),
    ('Stu003','Sub003','ACC003'),
    ('Stu004','Sub004','ACC004'),
    ('Stu005','Sub005','ACC005'),
    ('Stu006','Sub006','ACC006'),
    ('Stu007','Sub007','ACC007'),
    ('Stu008','Sub008','ACC008'),
    ('Stu009','Sub009','ACC009'),
    ('Stu010','Sub010','ACC010');
SELECT * 
FROM Student_Accounts;


INSERT INTO Reviews (`Review_ID`, `Review_Msg`, `Review_Date`, `Review_Rating`, `Tutor_ID`, `Student_ID`) -- not change value tutor and student yet
VALUES
('Re001','Great service, highly recommended!', '2024-03-14', 5, 'Tutor001','Stu001'),
('Re002','Could be better.', '2024-03-15', 3, 'Tutor001','Stu001'),
('Re003','Very satisfied with the product.', '2024-03-16', 4, 'Tutor001','Stu001'),
('Re004','Disappointed with the quality.', '2024-03-17', 2, 'Tutor001','Stu001'),
('Re005','Excellent experience overall.', '2024-03-18', 5, 'Tutor001','Stu001'),
('Re006','Good but could improve.', '2024-03-19', 4, 'Tutor001','Stu001'),
('Re007','Terrible customer service.', '2024-03-20', 1, 'Tutor001','Stu001'),
('Re008','Average experience, nothing special.', '2024-03-21', 3, 'Tutor001','Stu001'),
('Re009','Highly disappointed with the purchase.', '2024-03-22', 2, 'Tutor001','Stu001'),
('Re010','Exceptional quality and service.', '2024-03-23', 5, 'Tutor001','Stu001');
SELECT *
FROM Reviews;


INSERT INTO Applies_for (`Student_ID`,`Subject_ID`)
VALUES 
	('Stu001','Sub001'),
    ('Stu002','Sub002'),
    ('Stu003','Sub003'),
    ('Stu004','Sub004'),
    ('Stu005','Sub005'),
    ('Stu006','Sub006'),
    ('Stu007','Sub007'),
    ('Stu008','Sub008'),
    ('Stu009','Sub009'),
    ('Stu010','Sub010');
SELECT * 
FROM Applies_for;


INSERT INTO Matches (`Tutor_ID`,`Student_ID`)
VALUES 
    ('Tutor001','Stu001'),
    ('Tutor002','Stu002'),
    ('Tutor003','Stu003'),
    ('Tutor004','Stu004'),
    ('Tutor005','Stu005'),
    ('Tutor006','Stu006'),
    ('Tutor007','Stu007'),
    ('Tutor008','Stu008'),
    ('Tutor009','Stu009'),
    ('Tutor010','Stu010');
SELECT * 
FROM Matches;


-- DQL --


SELECT CONCAT(A.Account_FirstName, ' ', A.Account_LastName) AS Student_Name, SJ.Subject_Name AS Subject_Name
FROM Student_Accounts SA
JOIN Accounts A ON SA.Account_ID = A.Account_ID
JOIN Applies_for AF ON SA.Student_ID = AF.Student_ID
JOIN Subjects SJ ON AF.Subject_ID = SJ.Subject_ID;




CREATE TABLE TutorInformation (
    Tutor_ID char(8),
    Account_ID char(8),
    Education TEXT,
    Experience TEXT,
    SubjectsOffered TEXT,
    TeachingApproach TEXT,
    Availability TEXT,
    Location TEXT,
    Rates VARCHAR(100),
    imgpath VARCHAR(255),

    
    CONSTRAINT PK_AdminID PRIMARY KEY (Tutor_ID)
);

INSERT INTO TutorInformation (
    Tutor_ID,
    Account_ID,
    Education,
    Experience,
    SubjectsOffered,
    TeachingApproach,
    Availability,
    Location,
    Rates,
    imgpath
) VALUES (
    "Tutor001",
    "ACC021",
    "Graduated from St. John's Medical College with a degree in Medicine Certified in Advanced Biology Education from Mahidol University", 
    "2 years of experience tutoring biology at high school and college levels
Successfully helped numerous students improve their grades and understanding of biology concepts
Received recognition for outstanding teaching performance and student engagement",
    'General Biology,
Human Biology,
Anatomy,
AP Biology,
Physiology', 
    'Integrates real-world examples and practical applications to enhance comprehension
Tailors teaching methods to accommodate individual learning styles and preferences
Emphasizes critical thinking and problem-solving skills development', 
    'Flexible schedule for both in-person and online tutoring sessions
Available weekdays after 4:00 PM and weekends by appointment', 
    'Siam Center
Central Ladprao
Online tutoring available
',
    "$50 per hour for individual sessions
Special package rates available for multiple sessions"
,""
);

INSERT INTO TutorInformation (
    Tutor_ID,
    Account_ID,
    Education,
    Experience,
    SubjectsOffered,
    TeachingApproach,
    Availability,
    Location,
    Rates,
    imgpath
) VALUES
("Tutor002", "ACC022", "Graduate of Chulalongkorn University with a focus on Environmental Biology", "1 year experience as a teaching assistant in university labs", "Environmental Science, General Biology, Ecology", "Hands-on experiments and field trips to engage students", "Evenings and weekends", "Bangkok, Online", "THB 1500 per session",""),
("Tutor003", "ACC023", "Masters in Biochemistry from Kasetsart University", "3 years of experience with private tutoring for college students", "Biochemistry, Molecular Biology, General Chemistry", "Personalized study plans and interactive learning sessions", "Weekday afternoons and Saturday mornings", "Bangkok, Online", "THB 1800 per hour","https://drive.google.com/thumbnail?id=18PJjdBsCg9VmSROYYnfkatk_5wteSGC7"),
("Tutor004", "ACC024", "Bachelor's in Marine Biology from Prince of Songkla University", "Freelance tutor with 2 years experience", "Marine Biology, Ecology, Environmental Science", "Incorporates multimedia content and discussion-based learning", "Available on weekdays and Sunday", "Phuket, Online", "THB 1700 per session","https://drive.google.com/thumbnail?id=1izcz-4dhCXSEJCeokCKDRHDVgXEKZJs6"),
("Tutor005", "ACC025", "Ph.D. in Genetics from Mahidol University", "Over 4 years of experience in academic tutoring", "Genetics, Microbiology, Immunology", "Focus on conceptual understanding and research applications", "Monday to Friday evenings, full day on weekends", "Bangkok, Online", "THB 2000 per session",""),
("Tutor006", "ACC026", "Bachelor of Science in Physics from Thammasat University", "5 years teaching in public schools and private tutoring", "Physics, Calculus, General Science", "Use of simulations and practical examples to teach complex concepts", "After school hours and weekends", "Nonthaburi, Online", "THB 1200 per session",""),
("Tutor007", "ACC027", "B.Ed. in Science Education from Chiang Mai University", "Experience teaching in international schools for 3 years", "Chemistry, Biology, Environmental Science", "Interactive and student-centered learning environment", "Weekdays and Saturday afternoons", "Chiang Mai, Online", "THB 1500 per hour",""),
("Tutor008", "ACC028", "Masters in Mathematics Education from Silpakorn University", "Private math tutor for high school students, 6 years experience", "Algebra, Geometry, Statistics, Calculus", "Adaptive teaching strategy focusing on problem-solving", "Weeknights and weekends", "Bangkok, Online", "THB 1600 per hour",""),
("Tutor009", "ACC029", "Degree in English Language and Literature from Chulalongkorn University", "4 years ESL teaching experience, TEFL certified", "English Language, English Literature, TOEFL Prep", "Engaging conversational practice, immersive methods", "Flexible hours throughout the week", "Bangkok, Online", "THB 1300 per session",""),
("Tutor010", "ACC030", "Doctorate in Neuroscience from King Mongkut's Institute of Technology", "Research assistant for 2 years, tutored university-level courses", "Neuroscience, Human Biology, Anatomy", "Employs up-to-date research to inform teaching practices", "Evenings and weekends", "Bangkok, Pattaya, Online", "THB 2200 per session","");


 


