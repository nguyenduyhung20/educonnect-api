import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../config/AppError';
import { getTopicFromGemini } from '../config/gemini-client';

export const handleTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = {
      content: `CHIA SẺ MỘT VÀI SUY NGHĨ VỀ MÔN TOÁN HỌC ĐẾN CÁC EM HỌC SINH
      Ngày đăng: 23/10/2018 - 22:37
      Môn Toán có thể coi là một trong những môn học gắn bó dài nhất với cuộc đời học sinh. Từ trước đến nay, dù yêu thích hay không các em học sinh vẫn phải học toán, làm các bài kiểm tra, và vượt qua hàng loạt các kỳ thi quan trọng nhất với môn toán. Nhưng thực tế cho thấy, không ít học sinh lại không yêu thích môn Toán, thậm chí rất nản, sợ mỗi khi phải vượt qua các kỳ thi môn Toán. Vì những đẳng thức, phương trình gồm toàn những ký hiệu cộng trừ nhân chia..., thậm chí có cả những ký hiệu  ,  ..., cùng những số và chữ cái a, b, c, x, y, z, ...; ngoài ra có những danh từ kỹ thuật, nếu không học Toán, thì không biết đến, như " Nhóm ", " Vòng " " Thân ", " Không gian vectơ ", " Độc lập tuyến tính ". Là một giáo viên đứng lớp, xin chia sẻ với các em vài suy nghĩ về lợi ích của môn Toán học với hy vọng mang môn Toán đến gần với các em hơn.
      
      Trước hêt, chúng ta nên hiều lợi ích của bộ môn khoa học này
      
      Thứ nhất, Toán là môn thể thao dành cho bộ não
      
      Trong cuộc sống, chúng ta có thể không trở thành một vận động viên thể thao quốc tế nhưng chúng ta vẫn nên tập thể dục mỗi ngày để rèn luyện sức khỏe. Chúng ta có thể không cần trở thành nhà toán học hay giáo viên dạy toán nhưng vẫn nên học toán để “tập thể dục” cho bộ não của mình. Bộ não cũng như nhiều bộ phận khác trên cơ thể, càng được sử dụng và luyện tập sẽ càng khỏe mạnh. Vậy thì đừng nên quá băn khoăn rằng: “không biết học bài toán này sau này có dùng hay không?”, “mình làm bài tập toán về nhà làm gì cơ chứ?”. Xin trả lời rằng, làm bài tập toán chính là chúng ta đang nâng cấp cho khối tài sản vô giá và đáng yêu của chúng ta đấy bạn ạ.
      
      Thứ 2, môn Toán còn rèn luyện cho chúng ta thói quen tập trung
      
      Thực tế cho thấy có rất nhiều cách để rèn luyện sự tập trung như chơi cờ vua, các trò chơi trí tuệ,… và toán cũng là một trong số đó. Rất nhiều học sinh học không tốt vì không thể ngồi học một cách tập trung. Việc đó khiến các em kéo dài thời gian học mà vẫn không hiệu quả. Học toán có thể được xem như là “Vitamin” giúp các em học sinh dần dần thoát khỏi “căn bệnh” này.
      
      Thứ ba, học Toán sẽ giúp chúng ta giải quyết vấn đề thực tế nhanh nhẹn và hiệu quả trong công việc
      
      Đúng vậy, Nếu học Toán tốt sẽ giúp bạn sẽ rất nhạy cảm với các con số và phân tích vấn đề nhanh nhẹn hơn. Chẳng hạn: Toán chuyển động đều sẽ giúp bạn ước lượng thời gian về quê để ông bà có thể đón bạn đúng giờ.Đặc biệt với thời đại ngành công nghệ thông tin đang vô cùng phát triển, việc học giỏi toán lại càng trở thành một lợi thế lớn. Nhiều nhân vật đặc biệt trở thành những tỷ phú giàu nhất thế giới nhờ toán học như 2 nhà sáng lập của Google là 2 tiến sĩ toán ĐH Standford. Bill Gate (Microsoft ) hay Mark Zuckerberg(Facebook) đều là những người từng học toán giỏi và đỗ vào Đại Học Harvard…
      
      Thứ tư, học Toán sẽ giúp chúng ta có nhiều cơ hội khi tham gia các kỳ thi.
      
      Lợi ích gần nhất của việc học tốt môn toán mà các em học sinh thường thấy đó là giúp vượt qua các kỳ thi và có nhiều cơ hội hơn trong tương lai. Tại nhiều quốc gia trên thế giới, môn toán vẫn luôn có mặt trong các kỳ thi chuyển cấp và thi vào Đại Học. Thi lấy học bổng du học cũng thường thi tuyển bằng 2 môn toán, tiếng Anh và sau đó phỏng vấn.
      
      Lợi ích của việc học toán tốt thì có rất nhiều và chắc chắn mỗi người sẽ tự tìm thêm được những lợi ích khác phù hợp cho riêng mình. Nếu các em học sinh muốn học giỏi môn học nào đó chúng ta hãy nên dành những lời lẽ tốt đẹp nhất để nói về môn học đó để tự tạo động lực cho bản thân mình.
      
      Thứ năm, Toán học đâu phải là môn học trừu tượng, khô khan. Môn học này cũng đến với tâm hồn chúng ta qua bao vần thơ, qua những mẩu chuyện vui thật đáng nhớ.
      
      Xin hãy đến với những bài Toán thơ, thơ Toán trong dân gian hệ trước.
      
      Mặt em phương tượng chữ điền,
      Da em thì trắng, áo đen mặc ngoài.
      Lòng em có đất, có trời,
      Có câu nhân nghĩa, có lời hiếu trung.
      Dù khi quân tử có dùng,
      Thì em sẽ ngỏ tấm lòng cho xem.
      
      (Câu đố )
      
      Và một bài thơ Toán dân gian, cũng là một câu Đố Ca Dao nhí nhảnh :
      
      Yêu nhau cau sáu bổ ba,
      Ghét nhau cau sáu bổ ra làm mười.
      Mỗi người một miếng trăm người,
      Có mười bảy quả hỏi người ghét yêu.
      
      Nguyễn Trọng Báu - (Giai thoại chữ và nghĩa)
      
      (Ý bài toán : Có tất cả 17 quả cau được chia ra làm hai phần. Mỗi quả trong phần thứ nhất được bổ ra làm 3 miếng. Mỗi quả trong phần thứ hai được bổ ra làm 10 miếng. Có tất cả 100 người, mỗi người chỉ ăn một miếng. Hỏi có mấy người ăn được cau bổ ba, mấy người ăn được cau bổ mười.)
      
      (Đáp : 30 người ăn cau bổ ba, 70 người ăn cau bổ mười).
      
      Còn đây là những bài toán văn chương rất nhí nhảnh buộc người muốn giải phải suy nghĩ nhiều. Đó là:
      
      Câu Đố Ca Dao :
      
      Hai anh mà ở hai buồng,
      Không ai hỏi đến, ra tuồng cấm cung.
      Đêm thời đóng cửa gài chông,
      Ngày thời mở cửa lại trông ra ngoài.
      
      (Tục Ngữ - Phong Dao. Nguyễn Văn Ngọc (Mặc Lâm. Yiễm Yiễm Thư Quán. Sàigòn 1967)
      
      (Đáp : Hai con mắt).
      
      Một câu Thơ Toán :
      
      Vừa gà vừa chó,
      Bó lại cho tròn.
      Ba mươi sáu con,
      Một trăm chân chẵn.
      
      (Ý bài toán : Gà và chó có tất cả 36 con. Nếu đếm chân gà lẫn chân chó, thì có tất cả là 100 cái. Hỏi có mấy con chó và mấy con gà).
      
      (Đáp : 14 con chó và 22 con gà).
      
      Hay :
      
      Trâu đứng ăn năm.
      Trâu nằm ăn ba.
      Lụm khụm trâu già,
      Ba con một bó.
      Trăm trâu ăn cỏ.
      Trăm bó no nê.
      Hỏi đến giảng đề,
      Ngô nghê như điếc.
      
      Bài toán không khó, 3 ẩn số phải có 3 điều kiện độc lập. Phần nhiều 3 điều kiện độc lập được dựng bởi 3 phương trình độc lập. Cái " Ngô nghê như điếc " ở đây là chỉ có 2 điều độc lập có thể dựng bởi 2 phương trình độc lập, còn điều kiện thứ ba không phải là một phương trình mà là số nguyên dương mà nhiều người không để ý đến.
      
      (Ý bài toán : Có một trăm con trâu ăn hết một trăm bó cỏ. Mỗi con trâu đứng ăn đưọc năm bó. Mỗi con trâu nằm ăn được ba bó và ba con trâu già thì chia nhau chỉ ăn đưọc một bó. Hỏi có bao nhiêu con trâu đứng, bao nhiêu con trâu nằm và bao nhiêu con trâu già).
      
      (Đáp : 4 trâu đứng, 18 trâu nằm, 78 trâu già; hay 8 trâu đứng, 11 trâu nằm, 81 trâu già; hay 12 trâu đứng, 4 trâu nằm, 84 trâu già ).
      
      Còn rất nhiều, rất nhiều những vần thơ hay về Toán học mà chúng ta chưa khám phá để thấy rằng Toán học đi đến rất gần với cuộc sống của chúng ta. Yêu Toán học không chỉ giúp chúng ta trở nên nhanh trí mà Tâm hồn ta vẫn đẹp và làm đẹp hơn cho trí tuệ chúng ta. Xin được nhắc lại lời của Charles Darwin : “"Mọi phát kiến của nhân loại đều có bàn tay hướng dẫn của Toán học, bởi vì chúng ta không thể có một người chỉ đường nào khác".
      
                                                                      Vũ Thanh Phượng - GV Toán trường THCS Cao Xá`
    };

    const topic = await getTopicFromGemini(post.content);
    return res.status(200).json({ data: topic });
  } catch (error) {
    next(error);
  }
};

export const handleError = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new CustomError(418, 'Hello teapot');
  } catch (error) {
    next(error);
  }
};
