INSERT INTO
    "post" (content, user_id, parent_post_id, group_id)
VALUES
    ('Hello mọi người', 2, null, 1);

INSERT INTO
    "post" (title, content, user_id, create_at)
VALUES
    (
        'Title of example post',
        'Ngày mai phải đi học rồi.',
        1,
        '2023-01-01 00:00:01'
    );

INSERT INTO
    "post" (content, user_id, parent_post_id)
VALUES
    (
        'This is the first comment.',
        1,
        2
    );

INSERT INTO
    "post" (content, user_id, parent_post_id)
VALUES
    (
        'This is the first comment of first comment.',
        1,
        3
    );

INSERT INTO
    "post" (content, user_id, parent_post_id)
VALUES
    (
        'This is the second comment of first comment.',
        2,
        3
    );

INSERT INTO
    "post" (content, user_id, parent_post_id)
VALUES
    (
        'This is the third comment of first comment.',
        3,
        3
    );

INSERT INTO
    "post" (content, user_id, parent_post_id)
VALUES
    (
        'This is the second comment.',
        1,
        2
    );

INSERT INTO
    "post" (content, user_id, parent_post_id)
VALUES
    (
        'This is the third comment.',
        1,
        2
    );

INSERT INTO
    "post" (content, user_id, parent_post_id)
SELECT
    'This is subcomment 1',
    1,
    2
UNION
All
SELECT
    'This is subcomment 2',
    1,
    2
UNION
All
SELECT
    'This is subcomment 3',
    1,
    2;

WITH new_post AS (
    INSERT INTO
        "post" (title, content, user_id)
    VALUES
        (
            'Example 2: Post example',
            'Ngày thứ hai đi học.',
            1
        ) RETURNING id
)
INSERT INTO
    "post" (content, user_id, parent_post_id)
SELECT
    'This is first comment of second post',
    1,
    id
FROM
    new_post;

INSERT INTO
    "post" (content, user_id, parent_post_id)
SELECT
    'This is latest comment of first post',
    1,
    1;

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        'Năm 2024 Đại học Quốc gia TP.HCM công nhận tín chỉ cho học sinh tài năng',
        'Năm 2024, Đại học Quốc gia TP.HCM triển khai thí điểm một số môn học chung và công nhận tín chỉ cho học sinh THPT có tài năng vượt trội theo phương thức kết hợp trực tuyến và trực tiếp.',
        '{/public/imgs/3af4af00-a252-47a1-8b5f-fc39dab194cd_thpt_dhqg.webp}',
        4,
        null,
        null
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        'Học sinh THPT trải nghiệm một ngày làm sinh viên ĐH Quốc tế Hồng Bàng',
        'Học sinh THPT trải nghiệm một ngày làm sinh viên ĐH Quốc tế Hồng Bàng. Đây là chuỗi hoạt động xuyên suốt tháng 7 với chủ đề “Be a HIUer” - một ngày làm sinh viên Đại học Quốc tế Hồng Bàng, trải nghiệm 36 ngành học cực hot.',
        '{/public/imgs/8526ec08-d8ca-4779-9e2d-c61f7be4b33a_thpt_hopngbang.webp}',
        4,
        null,
        null
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        'Học sinh 3 tốt: Quả ngọt cho hành trình nỗ lực',
        'Học sinh 3 tốt: Quả ngọt cho hành trình nỗ lực. "Học sinh 3 tốt" không chỉ là mục tiêu phấn đấu mà như quả ngọt ghi nhận hành trình nỗ lực của các bạn học sinh THPT học tập và rèn luyện. Tuổi Trẻ có bàn tròn nhỏ cùng ba gương mặt "Học sinh 3 tốt" của TP.HCM: Phùng Kim Châu (Trường THPT Nguyễn Hữu Huân), Võ Hữu Khang (Trường trung học Thực hành ĐH Sư phạm TP.HCM) và Phạm Trang Linh (Trường THPT Nguyễn Thị Minh Khai).',
        '{/public/imgs/2cc8b3d5-8f97-4fa0-825a-6ba3e2c9d55d_tuoitre_hs3t.webp}',
        4,
        null,
        null
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        'Học sinh trung học phổ thông TP.HCM thi sáng tạo robot',
        'Học sinh trung học phổ thông TP.HCM thi sáng tạo robot. TTO - Đông đảo học sinh trung học phổ thông TP.HCM đã có mặt tại cuộc thi sáng tạo robot dành cho học sinh trung học phổ thông khởi tranh tại khuôn viên Trường THPT Âu Lạc (quận Tân Bình) chiều 3-12.',
        '{/public/imgs/dbb61cf1-c547-426c-aacb-b54bc26ce5cf_tuoitre_robot.webp}',
        4,
        null,
        null
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        'Đổi mới kỳ thi tốt nghiệp THPT và tuyển sinh ĐH: Riêng hay chung?',
        'Đổi mới kỳ thi tốt nghiệp THPT và tuyển sinh ĐH: Riêng hay chung?. TTO - Thực tế kỳ thi tốt nghiệp THPT và tuyển sinh ĐH những năm gần đây, đặc biệt là năm 2021, đặt ra yêu cầu cấp thiết phải đổi mới. Nhiều chuyên gia khẳng định phải tách rời hai hoạt động này, trong khi cũng không ít người có ý kiến ngược lại.',
        '{/public/imgs/da5c55c2-ade9-4633-82fb-412897baad2f_tuoitre_doimoi.webp}',
        4,
        null,
        null
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        'Infographic: Khi nào học sinh được chuyển trường?',
        'Infographic: Khi nào học sinh được chuyển trường?',
        '{/public/imgs/f348b110-4341-4928-b5b7-ea13f5c982ba_tuoitre_chuyentruong.webp}',
        4,
        null,
        null
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        '''Sai lầm lớn nhất'' của thiên tài Einstein',
        '''Sai lầm lớn nhất'' của thiên tài Einstein
        Albert Einstein là một nhà khoa học vĩ đại, nhưng cũng có những sai lầm giống như bất cứ ai. Với bản thân ông, sai lầm khoa học lớn nhất của mình là "muốn vũ trụ đứng yên". Quan điểm này từng thúc đẩy Einstein sửa lại các phương trình của mình, nhưng ông đã sai khi sửa chúng, IFL Science hôm 16/6 đưa tin.

Năm 1915, Einstein công bố thuyết tương đối rộng, vượt xa giới hạn của thuyết tương đối hẹp. Nó trở thành một lý thuyết toàn diện về lực hấp dẫn, không chỉ giải thích vũ trụ này mà cả những vũ trụ rất khác. Tuy nhiên, trong phần mô tả về lực hấp dẫn mà ông viết cho vũ trụ của con người, ông nhận thấy một vấn đề.

Einstein và hầu hết các nhà khoa học thời đó tin rằng vũ trụ là tĩnh: nó luôn như vậy và chưa bao giờ thay đổi, ít nhất là ở quy mô lớn. Dải Ngân Hà vẫn luôn như vậy và sẽ không có gì thay đổi.

Nhưng khi thêm các con số vào phép tính để Dải Ngân Hà tồn tại vĩnh cửu, một điều đặc biệt xảy ra. Mọi thứ kết thúc ở cùng một điểm, sụp đổ trong một hố đen (hố đen cũng xuất hiện từ các phương trình nhưng thời đó chưa quan sát được). Dải Ngân Hà không phải đang sụp đổ, nên để giải quyết xung đột triết học, Einstein đã thêm một tham số vào phương trình: hằng số vũ trụ.

Hằng số vũ trụ không có sự chứng mình bằng quan sát nào ngoài việc mọi thứ đang không sụp đổ vào một điểm. Tuy nhiên, trong vật lý, việc đề xuất sự tồn tại của thứ gì đó trước khi quan sát được cũng không phải chưa từng xảy ra.

Khi tạo ra một tham số vật lý gắn liền với thứ gì đó có thể không tồn tại, có lẽ tác giả nên cởi mở đón nhận những gợi ý và sửa chữa. Tuy nhiên, Einstein khá nhạy cảm khi bị đặt vấn đề về nó. Ông chỉ trích và nhiều lần xúc phạm các nhà khoa học khi họ chỉ ra rằng lý thuyết và các quan sát của chính Einstein cũng bắt đầu mâu thuẫn với hằng số vũ trụ. Trong vòng hai thập kỷ, quan điểm thống nhất chung đã áp đảo Einstein nên ông quyết định từ bỏ hằng số vũ trụ, gọi đó là "sai lầm lớn nhất" của mình.

Tuy nhiên, câu chuyện chưa kết thúc tại đây. Năm 1998, các nhà thiên văn phát hiện, sự giãn nở của vũ trụ đang tăng tốc. Yếu tố thúc đẩy vô hình và bí ẩn được gọi là năng lượng tối. Và cách tốt nhất hiện nay để mô tả nó trong phương trình của thuyết tương đối rộng chính là một hằng số vũ trụ. Dù khác với tham số Einstein từng đưa ra, đó vẫn là một hằng số vũ trụ. Có thể trong tương lai, giới khoa học sẽ phát hiện năng lượng tối không giống những gì họ nghĩ và các phương trình lại bị thay đổi, nhưng những sai lầm sẽ tạo điều kiện cho con người mở cánh cổng khám phá không gian.',
        '{/public/imgs/6e9ced50-6a8e-4b00-9b2d-d05b4c17ec07_express_einstein.jpg}',
        9,
        null,
        null
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        'Hơn 1.000 ngày đưa đón bạn tới trường',
        'TTO - Đó là câu chuyện về Đồng Thị Luyến, học sinh trường THPT Hiệp Hòa số 6 ở tỉnh Bắc Giang, suốt 3 năm trời ròng rã đón bạn Ngô Thị Lan Dung tới trường.',
        '{/public/imgs/4148928a-eb63-41ba-9d22-61a7f01bc66b_tuoitre_1000day.webp}',
        4,
        null,
        null
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        'Cấp giấy phép lái xe hạng A0: Học sinh hết "vô tư" chạy xe máy, xe đạp điện',
        'TTO - Người trên 16 tuổi sẽ được cấp giấy phép lái xe A0 được coi là một bước tiến lớn trong việc thay đổi ý thức người tham gia giao thông, đặc biệt là các em học sinh THPT.',
        '{/public/imgs/01fb188f-1b4f-4232-8d78-ca98c4a01aed_tuoitre_laixr.webp}',
        4,
        null,
        null
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        'Sự thật về cướp biển vùng Caribe trong lịch sử',
        'Sự thật về cướp biển vùng Caribe trong lịch sử.
        Nhắc đến “Cướp biển vùng Caribe”, nhiều người sẽ nghĩ ngay đến loạt phim điện ảnh đình đám. Tuy nhiên, trên thực tế, châu Mỹ thế kỉ 17 là thời đại hoàng kim của cướp biển.

Họ là những kẻ phiêu lưu, những nhà buôn, những chiến binh lão luyện. Lá cờ đen với chiếc đầu lâu trắng, rượu rum, và thịt muối ăn ngày này sang tháng khác.

Đại Tây Dương thế kỉ 17 là thiên đường của nghề cướp biển. Lúc này việc khai thác châu Mỹ đang diễn ra mạnh mẽ. Những chiếc tàu buôn tấp nập chở nô lệ tới Tân Thế giới, và trở về châu Âu chất đầy vàng, đường, thuốc lá cùng các hàng hóa phong phú khác. Các nước châu Âu vẫn còn là chế độ phong kiến, các hoàng gia vẫn lệ thuộc vào các nhóm lính đánh thuê chứ chưa có quân đội chính quy. Cải cách tôn giáo diễn ra, đẩy châu Âu vào những cuộc chiến liên miên giữa các tín đồ Kitô với Tin Lành. Các yếu tố đó làm cho Đại Tây Dương gần như trở nên vô chính phủ và nạn cướp biển hoành hành. Họ thậm chí còn thiết lập nhiều “thánh địa cướp biển”: những thành phố như Tortuga, Nassau là nơi các nhóm hải tặc tự do đi lại và tiêu thụ hàng hóa cướp được.

Có 2 loại hải tặc: những tay cướp biển thông thường (pirate) và các “thủy thủ tư nhân” (privateer). Các “thủy thủ tư nhân” này hoạt động như các nhóm lính đánh thuê, nhận tiền của chính phủ một nước để đi cướp phá tàu bè của nước khác. Nạn nhân chủ yếu của lực lượng này là các thuyền buôn Tây Ban Nha, thường xuyên bị chính phủ Anh, Pháp, Hà Lan thuê người để quấy nhiễu. Henry Morgan, một tay cướp biển dân xứ Wales, đã được phong tước hiệp sĩ nhờ những chiến tích của mình.

Thời đại của hải tặc kết thúc vào thế kỉ 18, khi các nước châu Âu bắt đầu xây dựng quân đội quốc gia và hạn chế sử dụng lính đánh thuê. Cướp biển trở thành những kẻ ngoài vòng pháp luật thật sự, và thường xuyên bị săn đuổi bởi hải quân ngày càng lớn mạnh của các nước. Năm 1718, Nassau, thánh địa cuối cùng của hải tặc, bị người Anh chiếm đóng. Cho dù thời đại hoàng kim đã kết thúc, cướp biển vẫn thỉnh thoảng được sử dụng như một công cụ chính trị, cho tới năm 1856, khi các nước phương Tây thông qua hiệp ước về luật hàng hải.

Những tay cướp biển của thế kỉ 17, qua thời gian đã trở thành một hình mẫu đặc sắc trong văn hóa đại chúng, được khai thác trong nhiều sản phẩm văn hóa, từ tiểu thuyết cho tới phim ảnh và game.',
        '{/public/imgs/eeecc12b-d47f-4738-8911-994b743d5e04_lsvn_teach.jpg}',
        8,
        null,
        null
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        'Cấp giấy phép lái xe hạng A0: Học sinh hết "vô tư" chạy xe máy, xe đạp điện',
        'TTO - Hơn 150 học sinh khối THPT của quận 6 (TP.HCM) đã cùng các cán bộ Đoàn tham gia chương trình "Đêm Xuân ấm áp" vào đêm 1-2 (27 Tết Kỷ Hợi).

Các bạn học sinh đã tỏa đi rong ruổi trên các đường phố của các quận 5, 6, 11 để tặng quà cho những người vô gia cư và người lao động, mưu sinh trong đêm. Đây là một trong những hoạt động của chiến dịch Xuân tình nguyện do Quận đoàn 6 thực hiện.

Anh Trương Thế Cường - trưởng ban Thanh niên trường học, Quận đoàn 6 - cho biết trong thiết kế chương trình có nội dung học sinh đi vận động quà để mang tặng những người nghèo, mưu sinh trong đêm. Đây cũng là cách giúp các bạn học trò THPT có dịp trải nghiệm cuộc sống và có thêm bài học về sẻ chia, yêu thương.

Những phần quà xuân đã được trao đi, những nụ cười ấm áp đêm xuân còn lưu mãi trong tim những bạn trẻ tuổi teen.',
        '{/public/imgs/6e50a3a0-2902-4196-baa8-5e80f69845f4_tuoitre_demxuan.webp}',
        4,
        null,
        null
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        'Nhà thơ Thanh Thảo trao học bổng "Thầy tôi" cho học sinh Sơn Mỹ',
        'Nhà thơ Thanh Thảo (Quảng Ngãi) trao học bổng ''Thầy tôi'' cho 15 học sinh Trường THPT Sơn Mỹ (xã Tịnh Khê, TP.Quảng Ngãi) với tổng số tiền là 45 triệu đồng.',
        '{/public/imgs/eedae338-d602-49fd-9831-07cfe903d55b_thanhnien_tangqua.webp}',
        5,
        null,
        null
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        'Tổ, Tông và Đế hay là Cách gọi tên các vị vua Việt Nam',
        'Tổ, Tông và Đế hay là Cách gọi tên các vị vua Việt Nam
        Chỉ sau khoảng 10 phút dạo quanh quận Hoàn Kiếm, Hà Nội, chúng ta có thể đi qua bốn con phố Ngô Quyền, Đinh Tiên Hoàng, Lê Thái Tổ và Quang Trung. Điều đáng nói là bốn vị vua này được gọi tên theo những cách hoàn toàn khác nhau:

- Ngô Quyền: Tên riêng, họ Ngô tên Quyền, không có tôn hiệu
- Đinh Tiên Hoàng: Họ Đinh + tôn xưng Tiên Hoàng (vị vua đã mất)
- Lê Thái Tổ: Họ Lê + miếu hiệu Thái Tổ
- Quang Trung: Niên hiệu của vị vua có tên thật là Nguyễn Huệ

Tại sao lại có những cách gọi khác nhau như trên? Trước hết hãy tìm hiểu về niên hiệu và miếu hiệu.

Niên hiệu là tên gọi do hoàng đế đặt ra khi lên ngôi, ví dụ như Thuận Thiên, Nguyên Phong, Hồng Đức, Gia Long, Minh Mạng… Tất cả các hoàng đế đều có niên hiệu.

Miếu hiệu là tên hiệu trong tông miếu dành cho các vị quân chủ sau khi họ qua đời, thường là do vị vua tiếp theo đặt cho vị vua trước. Miếu hiệu thường ngắn và có một trong hai từ Tổ hoặc Tông, đi trước nó là một tính từ miêu tả công đức của vị vua đó, ví dụ như Lý Thái Tổ, Trần Thái Tông, Lê Thánh Tông…. Phần lớn các hoàng đế từ thời Lý trở về sau có miếu hiệu, trừ một số trường hợp đặc biệt.

Bây giờ hãy trở lại trường hợp của 4 vị nói trên.

- Ngô Quyền: Chỉ xưng Vương, không xưng Đế, sách sử thường gọi ông là Tiền Ngô Vương. Con cháu Ngô Quyền sau này cũng không đặt miếu hiệu cho ông nên hậu thế chỉ có thể gọi ông là Ngô Vương/Ngô Vương Quyền/Ngô Quyền.

- Đinh Tiên Hoàng: Tên thật là Đinh Bộ Lĩnh, xưng đế và đặt niên hiệu là Thái Bình, nhưng con cháu không đặt miếu hiệu nên sử sách chỉ gọi là Đinh Tiên Hoàng.

- Lê Thái Tổ: Tên thật Lê Lợi, xưng đế với niên hiệu Thuận Thiên, về sau được tôn miếu hiệu là Thái Tổ.

- Quang Trung: Tên thật Nguyễn Huệ, xưng đế với niên hiệu Quang Trung, miếu hiệu là Thái tổ, thuỵ hiệu là Vũ Hoàng Đế.

Như vậy danh xưng Ngô Quyền và Đinh Tiên Hoàng là dễ hiểu. Nhưng câu chuyện của Lê Thái Tổ và Quang Trung lại đưa đến một kết luận khác: từ thời Lê trung hưng trở về trước, các hoàng đế Việt Nam hầu như luôn luôn được gọi bằng miếu hiệu (Lý/Trần/Lê + Thái Tổ/Thái Tông/Thánh Tông/Nhân Tông….), còn từ sau thời Lê thì họ được nhắc đến qua niên hiệu (Quang Trung, Cảnh Thịnh, Gia Long, Minh Mạng, Tự Đức, Duy Tân, Hàm Nghi….). Vì sao?

Bởi vì từ Lý đến Lê, các hoàng đế Việt Nam thường sử dụng nhiều niên hiệu trong suốt thời gian trị vì. Các vua nhà Lý thường có 5-6 niên hiệu, nhà Trần có 2, nhà Lê có 2-3… do đó việc sử dụng niên hiệu để gọi tên một vị vua đương nhiên không khả thi. Nếu dùng niên hiệu thì Lê Tư Thành có thể được gọi là vua Quang Thuận hoặc vua Hồng Đức, Trần Khâm có thể được gọi là Trùng Hưng hoặc Thiệu Bảo, còn nếu dùng miếu hiệu thì hai vị đó đơn giản là Lê Thánh Tông và Trần Nhân Tông. Cá biệt như Lý Thái Tông có tới 6 niên hiệu (Thiên Thành, Thông Thụy, Càn Phù Hữu Đạo, Minh Đạo, Thiên Cảm Thánh Vũ, Sùng Hưng Đại Bảo).

Kể từ Tây Sơn, các hoàng đế Việt Nam (trừ Nguyễn Quang Toản) đều chỉ có một niên hiệu. Nguyễn Huệ có niên hiệu Quang Trung, Nguyễn Phúc Ánh có niên hiệu Gia Long, Nguyễn Phúc Đảm có niên hiệu Minh Mạng, Nguyễn Phúc Vĩnh Thụy có niên hiệu Bảo Đại…. Do đó các sử gia dùng niên hiệu để gọi các vị này cho tiện.

Đến đây lại nảy sinh một câu hỏi nữa, vì sao kể từ Tây Sơn thì các hoàng đế Việt Nam chỉ dùng một niên hiệu? Vì phép đặt niên hiệu của hoàng đế Việt Nam bị ảnh hưởng nhiều bởi các hoàng đế Trung Hoa.

Từ Hán đến Tống, thuyết thiên nhân cảm ứng được đề cao nên các hoàng đế Trung Hoa thường xuyên thay đổi niên hiệu mỗi khi nước nhà bị hạn hán, lũ lụt… hoặc đơn giản là cảm thấy đang gặp nhiều vận đen. Nói nôm na là “đổi tên để mong đổi vận”. Kể từ triều Minh, vai trò của thuyết thiên nhân cảm ứng được hạ thấp nên các hoàng đế chỉ đặt một niên hiệu, bắt đầu từ Hồng Vũ Đế Chu Nguyên Chương. Nhà Thanh vào Trung Nguyên và tiếp thu phần lớn chế độ của triều Minh, bao gồm cả cách đặt niên hiệu. Vì học theo phép đặt niên hiệu của hai triều Minh - Thanh nên các hoàng đế nhà Nguyễn cũng chỉ có một niên hiệu duy nhất.

Tóm lại, vì chịu ảnh hưởng của các triều đại Trung Hoa từ Hán, Đường đến Tống nên các triều đại Việt Nam từ Lý, Trần, Lê thường dùng nhiều niên hiệu, khiến sử gia phải dùng miếu hiệu để gọi các hoàng đế, từ đó tạo ra những tên đường như Trần Nhân Tông, Lê Thánh Tông… . Vì học theo hai triều Minh, Thanh nên vua nhà Nguyễn chỉ có một niên hiệu, từ đó chúng ta có những con đường như Thành Thái, Duy Tân, Hàm Nghi… Đó có lẽ cũng là một điểm thú vị của tên các con phố Hà Nội.',
        '{/public/imgs/548bb3fb-24df-4a14-b761-b712a905a6de_lsvn_tenvua.jpg}',
        8,
        null,
        null
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        '“Điều quan trọng nhất khi chọn trường, lớp là sự phù hợp. Học sinh vui vẻ, hạnh phúc, khi về nhà tràn ngập tiếng cười”, Thầy giáo Võ Quốc Bá Cẩn nổi tiếng với những lớp có 100% học sinh đỗ trường chuyên chia sẻ.',
        '“Điều quan trọng nhất khi chọn trường, lớp là sự phù hợp. Học sinh vui vẻ, hạnh phúc, khi về nhà tràn ngập tiếng cười”, Thầy giáo Võ Quốc Bá Cẩn nổi tiếng với những lớp có 100% học sinh đỗ trường chuyên chia sẻ.
        Thầy Võ Quốc Bá Cẩn, Trường THCS Archimedes (Hà Nội), người truyền cảm hứng, đào tạo nhiều học sinh giỏi, bất ngờ tiết lộ từng thi trượt trường chuyên và chọn sai nghề trước khi dạy học.',
        '{/public/imgs/54031e27-f6cd-490a-9b22-115066d03b79_kh_voquocbacan.jpg}',
        6,
        null,
        null
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        'Câu chuyện về hai người bạn thân ở hai đầu chiến tuyến trong chiến dịch Nguyễn Huệ',
        'Câu chuyện về hai người bạn thân ở hai đầu chiến tuyến trong chiến dịch Nguyễn Huệ.
        Trong chiến dịch Nguyễn Huệ (1/4/1972 đến 19/1/1973), việc phòng thủ mặt Nam của tiểu khu Bình Long, chỉ rộng không đầy 3km2 được giao cho trung tá Nguyễn Thống Thành chỉ huy. Đó cũng chính là hướng tấn công của Trung đoàn 201A quân Giải phóng do Chính ủy Nguyễn Văn Có phụ trách.
Lịch sử oái oăm: Thiếu tá Nguyễn Văn Có bên tấn công và Trung tá Nguyễn Thống Thành bên phòng thủ, cách đó không lâu lại là một cặp bạn bè thân thiết!
Nguyễn Văn Có - trưởng phòng Hành quân Bộ Tổng tham mưu quân lực VNCH, là một điệp viên Mặt trận Giải phóng đã được cài cắm từ lâu, chính ông là người tham gia soạn bản đồ hành quân chiến dịch Lam Sơn 719. cũng chính ông ta là người thay Đại tướng Tổng Tham mưu trưởng Cao Văn Viên thuyết trình kế hoạch hành quân sang Hạ Lào cho Nguyễn Văn Thiệu và các tướng lĩnh cao cấp của Mỹ trên Hạm đội 7 trước khi chiến dịch mở màn.
Sau thất bại nặng nề ở Lào, tình báo Mỹ và VNCH tập trung truy tìm các “Việt Cộng nằm vùng”, nhưng đến tháng 3/1972, khi có lệnh bắt giữ để điều tra thì người ta mới phát hiện thiếu tá Nguyễn Văn Có đã biến mất mà không ai hay biết.
Hai tháng sau, tại mặt trận tiểu khu Bình Long, sau khi ăn vài quả đắng, trung tá Nguyễn Thống Thành mới biết được chỉ huy trung đoàn 201A quân Giải phóng (chủ lực miền) đang tấn công mình chính là ông bạn cũ: thiếu tá Nguyễn Văn Có. Việc quân VNCH bị dập tơi bời ở đây chẳng có gì khó hiểu: chính ông Có - trước khi bị lộ - là người tham gia soạn thảo kế hoạch phòng thủ đường 13, mặt trận Bình Long cho quân lực VNCH.
Chính ủy Nguyễn Văn Có đã có một đề xuất táo bạo: cho đặc công bắt cóc Nguyễn Thống Thành nhằm làm nhụt ý chí của binh sĩ địch. Giao nhiệm vụ cho một tổ trinh sát đặc công thiện chiến, vị chính ủy dặn đi dặn lại: “Chỉ được bắt sống. Không bắt được thì hủy nhiệm vụ, tuyệt đối không được giết. Ông ấy là bạn tôi”.
Trước sự phòng thủ dày đặc ở Tiểu khu Bình Long, ý đồ bắt Nguyễn Thống Thành đã không thể thực hiện được. Thay vào đó, tổ trinh sát đã đưa được vào tận phòng ở của viên tỉnh trưởng tại sở chỉ huy tiền phương một bức thư do ông Có tự tay chấp bút. Trong thư, vị chính ủy cảnh báo viên tỉnh trưởng: sự thất bại và sụp đổ của chế độ Sài Gòn là không thể tránh khỏi, chỉ còn tính từng ngày. Ông khuyên bạn cũ nên triệt thoái quân lực để đỡ tốn xương máu của binh sĩ.
Tết Nguyên đán năm 1973, một thùng hàng được thả xuống trận địa quân Giải phóng, ghi rõ “kính gửi ông Sáu Đột (tức Nguyễn Văn Có), Chính ủy Trung đoàn 201”. Khui thùng hàng, tổ trinh sát thấy trong đó có mấy thùng thịt hộp, một ít hoa quả khô, một thùng rượu whisky, 10 cây thuốc lá Ruby… và một số xa xỉ phẩm khác, kèm một phong thư. Chuyển thư cho thủ trưởng xong, sợ bỏ thuốc độc trong quà, anh em khui một hộp thịt, định cho chó ăn thử.
Đúng lúc đó, ông Có xuất hiện, tay cầm phong thư của viên tỉnh trưởng. Ông khoát tay: “Không cần thử. Ông ấy không cùng chiến tuyến, nhưng không phải là hạng tiểu nhân”. Sau đó, ông đưa thư cho trợ lý Nguyễn Mạnh Hồng đọc.
“Kính gửi ông Nguyễn Văn Có (Sáu Đột),
Chính ủy Trung đoàn 201
Nhân dịp Tết đến, Xuân về, tôi, đại tá Nguyễn Thống Thành, Tỉnh trưởng, Tiểu khu trưởng Bình Long, quân lực Việt Nam Cộng hòa xin có mấy lời gửi thăm sức khỏe ông.
Thưa ông, tôi với ông bây giờ hai người đã hai đầu chiến tuyến, gặp nhau chắc chỉ trên chiến địa, trò chuyện cùng nhau chắc chỉ bằng súng đạn. Dù sao, chúng ta cũng đã từng bạn bè thân thiết nhiều năm. Tôi vẫn luôn nhớ còn thiếu nợ ông 1.000.000 đồng chưa trả. Xin hứa danh dự, tôi sẽ gửi lại và cảm ơn đầy đủ bất kỳ khi nào có dịp.
Xin gửi ông một ít quà vui Tết.
Chúc ông sức khỏe và hẹn ông trên chiến địa.
Bạn cũ
Nguyễn Thống Thành”.
Nghe đọc lại thư, ông Có phì cười: “Thằng cha tỉnh trưởng này sợ rồi, nhưng khôn. Ổng sợ tôi cho anh em vào hạ sát, nên viết thư gợi tình xưa nghĩa cũ để mình đừng ra tay đó mà. Ruby cứ hút, thịt hộp, rượu mạnh anh em cứ dùng. Lính tráng bên này bên kia nhưng bạn bè cứ là bạn bè, mình ghi nhận”.
Hiệp định Paris ký kết tháng 1/1973, chiến sự Bình Long dịu xuống. Tuy nhiên số phận thế nào, hai người bạn cũ lại đụng độ nhau trên chiến trường Phước Long cuối năm 1974 đầu 1975. Khi đó, trung đoàn 201 của Nguyễn Văn Có phối hợp với các đơn vị địa phương đánh thẳng vào trung tâm thị xã. Quân binh tan tác, Nguyễn Thống Thành (lúc này là đại tá) bỏ chạy ra bờ sông Bé và thiệt mạng khi chạm súng với một đơn vị trinh sát của chính trung đoàn 201.',
        '{/public/imgs/486ff478-e7b6-469a-919d-38db232805e8_lsvn_banthan.jpg,/public/imgs/3382106a-585f-412e-ab80-44507e40a732_lsvn_banthan2.jpg}',
        8,
        null,
        null
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        '',
        'Trà là loại đố uống xuất xứ từ Trung Quốc. Ở Châu Âu, những thương nhân người Bồ Đào Nha là những người đầu tiên uống trà và giới thiệu nó với người nước mình. Đến đầu thế kỷ 17, trà lần đầu tiên du nhập vào Anh, Hà Lan. 
Xem chi tiết ở phía dưới!',
        '{https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/416336289_773848008118525_2640504804500294432_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=3635dc&_nc_eui2=AeHv6rCYYJRWOTpCy5uqY4gAjP_4b2hBHYiM__hvaEEdiHQST8kiPC2WiCDwsbeaRk2_Ta8_mpJh7YPA40RkaBOM&_nc_ohc=mm1szwLL6JAAX90JhN3&_nc_ht=scontent.fsgn19-1.fna&oh=00_AfC5B9s0GbvV0Eek4Nn0Sd5mHjYQS53f215Lvirt8KbrWw&oe=65AD7310}',
        8,
        null,
        2
    );

INSERT INTO
    "post" (
        title,
        content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        '',
        'Đánh nhau cũng tranh thủ đun nước pha trà',
        13,
        30,
        2
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        '',
        'Trước khi đến Việt Nam, lí.nh M.ỹ đã được học một khóa thời lượng 5 tiếng về các loại b.ẫy mà người Đức và người Nhật từng sử dụng trong th.ế chi.ến II. 
Nhưng rồi, họ nhanh chóng nhận ra phần lớn kiến thức đó đều vô dụng ở dải đất bé nhỏ hình chữ S này...
Xem chi tiết ở phía dưới!',
        '{https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/415001512_771163845053608_8844311999638558726_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=3635dc&_nc_eui2=AeGZHC94YfL7Gtjjfkq_bfjMWqxWQvrnD1NarFZC-ucPU0yBjv0WvACUqanTuoOWoyTRjgPOmAHPEwS8YH2OchG_&_nc_ohc=qK4WjPlix9YAX8Qqv3u&_nc_ht=scontent.fsgn19-1.fna&oh=00_AfDH1ZuOgwTXEBXU-UXasekwu-KCP4woYzH_6kzo61TumA&oe=65AC558D}',
        8,
        null,
        2
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        '',
        'Ngày này năm xưa: Ngày 28/12/1964 - Trận Bình Giã
Trận Bình Giã là trậ.n đán.h chính nằm trong Chiế.n dị.ch Bình Giã xảy ra vào cuối tháng 12 năm 1964 tại địa bàn làng Bình Giã, tỉnh Phước Tuy, cách Sài Gòn 67 km, giữa Quân giả.i phó.ng miền Nam và Quâ.n lự.c Việt Nam Cộng hòa, với cố vấn Mỹ chỉ huy. 
Xem chi tiết ở bên dưới!',
        '{https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/414745853_767047918798534_928225736976030664_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=3635dc&_nc_eui2=AeGMj28dJPnBGGzudXVYu04ZkIlkfp0aXDGQiWR-nRpcMe-k3Z2z6J_ux8yR1VoAgdjJCxlsgTXaVfGDlxDr--h_&_nc_ohc=w0BY-fgx8PcAX9gT9pY&_nc_ht=scontent.fsgn19-1.fna&oh=00_AfAeIC5vWvGj_445pX5LV3k3hGQcLRvImhrsotJJGqzSAw&oe=65AC7CCF}',
        8,
        null,
        2
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        '',
        'Ngày này năm xưa: 29/12/1427 - Quân Minh rút về nước, khởi nghĩa Lam Sơn chính thức thắng lợi
Xem chi tiết ở bình luận.',
        '{https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/414667383_767955198707806_860536884531408043_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=3635dc&_nc_eui2=AeEvnhodA6BjZAm3wEhK13oh6Sv52VDDmX3pK_nZUMOZfVYrA2SDW708agtt670I0NuWhkn1Qq8Gudjr9DH_oqWx&_nc_ohc=vhaW76RrTC4AX_S6OwP&_nc_ht=scontent.fsgn19-1.fna&oh=00_AfCt512nHqm25y6AroYdKML1IXQOhKPXny_JvXAhb5Wb_w&oe=65AD4D5F}',
        8,
        null,
        2
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        '',
        'Trong chiế.n dị.ch Nguyễn Huệ (1/4/1972 đến 19/1/1973), việc phò.ng th.ủ mặt Nam của tiểu khu Bình Long, chỉ rộng không đầy 3km2 được giao cho trung tá Nguyễn Thống Thành chỉ huy. Đó cũng chính là hướng tấ.n cô.ng của Trung đoàn 201A quân Giải phóng do Chính ủy Nguyễn Văn Có phụ trách.
Một điều oái oăm: Thiếu tá Nguyễn Văn Có bên tấ.n cô.ng và Trung tá Nguyễn Thống Thành bên phò.ng th.ủ, cách đó không lâu lại là một cặp bạn bè thân thiết!
Xem thêm ở phần bình luận.',
        '{/public/imgs/486ff478-e7b6-469a-919d-38db232805e8_lsvn_banthan.jpg,/public/imgs/3382106a-585f-412e-ab80-44507e40a732_lsvn_banthan2.jpg}',
        8,
        null,
        2
    );

INSERT INTO
    "post" (
        title,
        content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        '',
        'Không tránh khỏi trong chiến tranh ..',
        10,
        35,
        2
    );

INSERT INTO
    "post" (
        title,
        content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        '',
        'Tài liệu này mà làm phim thì Hollywood tuổi',
        11,
        35,
        2
    );

INSERT INTO
    "post" (
        title,
        content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        '',
        'hơi tiếc nhỉ, ô Thống mà còn sống hoà bình 2 ô gặp lại nhau thì hay',
        12,
        35,
        2
    );

INSERT INTO
    "post" (
        title,
        content,
        file_content,
        user_id,
        parent_post_id,
        group_id
    )
VALUES
    (
        'Bất đẳng thức Cauchy',
        'Bất đẳng thức Cauchy',
        '{/public/imgs/e89e1a91-e968-45dc-ab2c-4fe634ac917b_cauchy.png}',
        2,
        null,
        null
    );