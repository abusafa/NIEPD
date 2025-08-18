import React from 'react';
import { Calendar, User, Tag, Share2, ArrowLeft, ArrowRight, Clock, Eye, ThumbsUp, MessageCircle } from 'lucide-react';

interface NewsDetailPageProps {
  currentLang: 'ar' | 'en';
  newsId: number;
  onBack: () => void;
}

const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ currentLang, newsId, onBack }) => {
  const content = {
    ar: {
      backToNews: 'العودة للأخبار',
      publishedOn: 'نُشر في',
      author: 'الكاتب',
      category: 'التصنيف',
      tags: 'الكلمات المفتاحية',
      readTime: 'وقت القراءة',
      views: 'المشاهدات',
      shareArticle: 'شارك المقال',
      relatedNews: 'أخبار ذات صلة',
      readMore: 'اقرأ المزيد',
      minutes: 'دقائق',
      likes: 'إعجاب',
      comments: 'تعليق',
      share: 'مشاركة',
      print: 'طباعة',
      downloadPDF: 'تحميل PDF',
      contactAuthor: 'تواصل مع الكاتب',
      reportIssue: 'الإبلاغ عن مشكلة',
      lastUpdated: 'آخر تحديث',
      source: 'المصدر'
    },
    en: {
      backToNews: 'Back to News',
      publishedOn: 'Published on',
      author: 'Author',
      category: 'Category',
      tags: 'Tags',
      readTime: 'Read time',
      views: 'Views',
      shareArticle: 'Share Article',
      relatedNews: 'Related News',
      readMore: 'Read More',
      minutes: 'minutes',
      likes: 'Likes',
      comments: 'Comments',
      share: 'Share',
      print: 'Print',
      downloadPDF: 'Download PDF',
      contactAuthor: 'Contact Author',
      reportIssue: 'Report Issue',
      lastUpdated: 'Last updated',
      source: 'Source'
    }
  };

  const t = content[currentLang];
  const ArrowIcon = currentLang === 'ar' ? ArrowRight : ArrowLeft;

  // News data - in a real app, this would come from props or API
  const newsData = [
    {
      id: 1,
      titleAr: 'لقاء دور الإدارة المدرسية في بناء العلاقات الإيجابية',
      titleEn: 'Session on School Administration Role in Building Positive Relationships',
      summaryAr: 'ينظم المعهد الوطني للتطوير المهني التعليمي لقاءً تطويرياً متخصصاً حول دور الإدارة المدرسية في بناء العلاقات الإيجابية داخل المجتمع المدرسي',
      summaryEn: 'The National Institute for Educational Professional Development organizes a specialized development session on the role of school administration in building positive relationships within the school community',
      contentAr: `
        <p>ينظم المعهد الوطني للتطوير المهني التعليمي لقاءً تطويرياً متخصصاً حول دور الإدارة المدرسية في بناء العلاقات الإيجابية داخل المجتمع المدرسي، وذلك يوم الأحد الموافق 18 أغسطس 2025م، من الساعة 9:00 صباحاً حتى 12:00 ظهراً.</p>

        <h2>أهداف اللقاء</h2>
        <p>يهدف هذا اللقاء التطويري إلى تزويد القيادات التعليمية بالمهارات والاستراتيجيات اللازمة لبناء علاقات إيجابية وفعالة مع جميع أطراف المجتمع المدرسي، بما يشمل:</p>
        <ul>
          <li>المعلمين وأعضاء الهيئة التعليمية</li>
          <li>الطلاب وتنمية شخصياتهم</li>
          <li>أولياء الأمور والمجتمع المحلي</li>
          <li>الإدارات التعليمية والجهات ذات العلاقة</li>
        </ul>

        <h2>محاور اللقاء</h2>
        <p>سيتناول اللقاء عدة محاور مهمة تشمل:</p>
        <ol>
          <li><strong>أسس بناء العلاقات الإيجابية:</strong> التعرف على المبادئ الأساسية لبناء علاقات صحية ومثمرة في البيئة المدرسية</li>
          <li><strong>استراتيجيات التواصل الفعال:</strong> تطوير مهارات التواصل مع مختلف الأطراف في المجتمع المدرسي</li>
          <li><strong>إدارة الصراعات:</strong> كيفية التعامل مع التحديات والصراعات بطريقة إيجابية وبناءة</li>
          <li><strong>بناء ثقافة مدرسية إيجابية:</strong> خلق بيئة تعليمية محفزة وداعمة للجميع</li>
        </ol>

        <h2>الفئة المستهدفة</h2>
        <p>يستهدف هذا اللقاء:</p>
        <ul>
          <li>مديري ومديرات المدارس</li>
          <li>وكلاء المدارس</li>
          <li>المشرفين التربويين</li>
          <li>القيادات التعليمية في الإدارات التعليمية</li>
        </ul>

        <h2>المتحدثون</h2>
        <p>سيقدم اللقاء نخبة من الخبراء والمختصين في مجال الإدارة التعليمية والتطوير المهني، حيث سيشاركون خبراتهم وتجاربهم العملية في بناء العلاقات الإيجابية داخل المجتمع المدرسي.</p>

        <h2>طريقة المشاركة</h2>
        <p>سيُعقد اللقاء بشكل افتراضي عبر منصة زووم، مما يتيح للمشاركين من جميع أنحاء المملكة الاستفادة من هذا اللقاء التطويري المهم. سيتم إرسال رابط الدخول للمسجلين قبل موعد اللقاء بـ 24 ساعة.</p>

        <h2>التسجيل والمشاركة</h2>
        <p>للتسجيل في هذا اللقاء التطويري، يرجى زيارة الموقع الرسمي للمعهد والتسجيل قبل تاريخ 15 أغسطس 2025م. عدد المقاعد محدود بـ 500 مشارك.</p>
      `,
      contentEn: `
        <p>The National Institute for Educational Professional Development organizes a specialized development session on the role of school administration in building positive relationships within the school community, on Sunday, August 18, 2025, from 9:00 AM to 12:00 PM.</p>

        <h2>Session Objectives</h2>
        <p>This development session aims to provide educational leaders with the necessary skills and strategies to build positive and effective relationships with all members of the school community, including:</p>
        <ul>
          <li>Teachers and educational staff members</li>
          <li>Students and their personality development</li>
          <li>Parents and the local community</li>
          <li>Educational administrations and related entities</li>
        </ul>

        <h2>Session Topics</h2>
        <p>The session will cover several important topics including:</p>
        <ol>
          <li><strong>Foundations of Building Positive Relationships:</strong> Understanding the basic principles of building healthy and fruitful relationships in the school environment</li>
          <li><strong>Effective Communication Strategies:</strong> Developing communication skills with different parties in the school community</li>
          <li><strong>Conflict Management:</strong> How to deal with challenges and conflicts in a positive and constructive manner</li>
          <li><strong>Building a Positive School Culture:</strong> Creating a motivating and supportive educational environment for everyone</li>
        </ol>

        <h2>Target Audience</h2>
        <p>This session targets:</p>
        <ul>
          <li>School principals</li>
          <li>Assistant principals</li>
          <li>Educational supervisors</li>
          <li>Educational leaders in educational administrations</li>
        </ul>

        <h2>Speakers</h2>
        <p>The session will be presented by a select group of experts and specialists in educational administration and professional development, who will share their expertise and practical experiences in building positive relationships within the school community.</p>

        <h2>Participation Method</h2>
        <p>The session will be held virtually via Zoom platform, allowing participants from all over the Kingdom to benefit from this important development session. The access link will be sent to registrants 24 hours before the session.</p>

        <h2>Registration and Participation</h2>
        <p>To register for this development session, please visit the Institute's official website and register before August 15, 2025. The number of seats is limited to 500 participants.</p>
      `,
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200',
      publishDate: '2025-08-10',
      lastUpdated: '2025-08-12',
      authorAr: 'فريق التحرير',
      authorEn: 'Editorial Team',
      categoryAr: 'فعاليات',
      categoryEn: 'Events',
      tagsAr: ['الإدارة المدرسية', 'العلاقات الإيجابية', 'التطوير المهني', 'القيادة التعليمية'],
      tagsEn: ['School Administration', 'Positive Relationships', 'Professional Development', 'Educational Leadership'],
      readTime: 5,
      views: 1250,
      likes: 89,
      comments: 12,
      featured: true,
      sourceAr: 'المعهد الوطني للتطوير المهني التعليمي',
      sourceEn: 'National Institute for Educational Professional Development'
    },
    {
      id: 2,
      titleAr: 'المعهد الوطني للتطوير المهني التعليمي يشارك في المعرض الدولي للتعليم',
      titleEn: 'National Institute for Educational Professional Development Participates in International Education Exhibition',
      summaryAr: 'شارك المعهد الوطني للتطوير المهني التعليمي في المعرض الدولي للتعليم، حيث قدم عرضاً شاملاً لبرامجه وخدماته التطويرية',
      summaryEn: 'The National Institute for Educational Professional Development participated in the International Education Exhibition, presenting a comprehensive display of its programs and development services',
      contentAr: `
        <p>شارك المعهد الوطني للتطوير المهني التعليمي في المعرض الدولي للتعليم الذي أقيم في مركز الرياض الدولي للمؤتمرات والمعارض خلال الفترة من 15 إلى 17 أبريل 2025م، حيث قدم عرضاً شاملاً لبرامجه وخدماته التطويرية المتنوعة.</p>

        <h2>مشاركة متميزة</h2>
        <p>تميزت مشاركة المعهد في المعرض بتقديم جناح تفاعلي يعكس رؤية المعهد ورسالته في تطوير القدرات المهنية للمعلمين والقيادات التعليمية. وقد شمل الجناح:</p>
        <ul>
          <li>عرض تفاعلي لبرامج المعهد المختلفة</li>
          <li>منصة تجريبية للمنصة الإلكترونية</li>
          <li>ورش عمل مصغرة للزوار</li>
          <li>لقاءات مع خبراء المعهد</li>
        </ul>

        <h2>البرامج المعروضة</h2>
        <p>استعرض المعهد خلال مشاركته مجموعة واسعة من البرامج التطويرية، منها:</p>
        <ol>
          <li><strong>برنامج إعداد المعلم:</strong> البرنامج الرائد بالشراكة مع المعهد الوطني للتعليم في سنغافورة</li>
          <li><strong>مسارات المعلم الفاعل:</strong> سلسلة من البرامج التطويرية المتدرجة</li>
          <li><strong>برامج القيادة التعليمية:</strong> لتطوير قدرات القيادات المدرسية</li>
          <li><strong>برامج STEM:</strong> لتعزيز تعليم العلوم والتكنولوجيا</li>
        </ol>

        <h2>ورش العمل المتخصصة</h2>
        <p>نظم المعهد خلال أيام المعرض الثلاثة عدة ورش عمل متخصصة، شملت:</p>
        <ul>
          <li>ورشة "التعلم الرقمي وتطبيقاته في التعليم"</li>
          <li>ورشة "استراتيجيات التقويم الحديثة"</li>
          <li>ورشة "بناء المناهج التفاعلية"</li>
          <li>ورشة "القيادة التحويلية في التعليم"</li>
        </ul>

        <h2>التفاعل مع الزوار</h2>
        <p>شهد جناح المعهد إقبالاً كبيراً من الزوار، حيث تفاعل أكثر من 5000 زائر مع العروض والأنشطة المقدمة. وقد أبدى الزوار اهتماماً كبيراً بالبرامج المطروحة وطرق التسجيل فيها.</p>

        <h2>الشراكات الجديدة</h2>
        <p>استطاع المعهد خلال مشاركته في المعرض عقد عدة اتفاقيات شراكة جديدة مع مؤسسات تعليمية محلية ودولية، مما يعزز من قدرته على تقديم برامج تطويرية متنوعة وعالية الجودة.</p>

        <h2>التطلعات المستقبلية</h2>
        <p>أكد المعهد من خلال مشاركته على التزامه بمواصلة تطوير برامجه وخدماته لتواكب أحدث التطورات في مجال التعليم والتطوير المهني، وذلك تماشياً مع رؤية المملكة 2030.</p>
      `,
      contentEn: `
        <p>The National Institute for Educational Professional Development participated in the International Education Exhibition held at the Riyadh International Convention & Exhibition Center from April 15-17, 2025, presenting a comprehensive display of its diverse programs and development services.</p>

        <h2>Distinguished Participation</h2>
        <p>The Institute's participation in the exhibition was distinguished by presenting an interactive pavilion that reflects the Institute's vision and mission in developing the professional capabilities of teachers and educational leaders. The pavilion included:</p>
        <ul>
          <li>Interactive display of the Institute's various programs</li>
          <li>Trial platform for the electronic platform</li>
          <li>Mini workshops for visitors</li>
          <li>Meetings with Institute experts</li>
        </ul>

        <h2>Programs Showcased</h2>
        <p>The Institute showcased a wide range of development programs during its participation, including:</p>
        <ol>
          <li><strong>Teacher Preparation Program:</strong> The flagship program in partnership with the National Institute of Education in Singapore</li>
          <li><strong>Effective Teacher Tracks:</strong> A series of progressive development programs</li>
          <li><strong>Educational Leadership Programs:</strong> To develop school leadership capabilities</li>
          <li><strong>STEM Programs:</strong> To enhance science and technology education</li>
        </ol>

        <h2>Specialized Workshops</h2>
        <p>The Institute organized several specialized workshops during the three days of the exhibition, including:</p>
        <ul>
          <li>Workshop on "Digital Learning and Its Applications in Education"</li>
          <li>Workshop on "Modern Assessment Strategies"</li>
          <li>Workshop on "Building Interactive Curricula"</li>
          <li>Workshop on "Transformational Leadership in Education"</li>
        </ul>

        <h2>Visitor Interaction</h2>
        <p>The Institute's pavilion witnessed great turnout from visitors, with more than 5,000 visitors interacting with the presentations and activities offered. Visitors showed great interest in the programs offered and registration methods.</p>

        <h2>New Partnerships</h2>
        <p>The Institute was able to conclude several new partnership agreements with local and international educational institutions during its participation in the exhibition, enhancing its ability to provide diverse and high-quality development programs.</p>

        <h2>Future Aspirations</h2>
        <p>The Institute confirmed through its participation its commitment to continue developing its programs and services to keep pace with the latest developments in education and professional development, in line with Saudi Vision 2030.</p>
      `,
      image: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=1200',
      publishDate: '2025-04-20',
      lastUpdated: '2025-04-22',
      authorAr: 'إدارة الإعلام والاتصال',
      authorEn: 'Media and Communication Department',
      categoryAr: 'أخبار',
      categoryEn: 'News',
      tagsAr: ['معرض التعليم', 'الشراكات', 'البرامج التطويرية', 'التعليم الرقمي'],
      tagsEn: ['Education Exhibition', 'Partnerships', 'Development Programs', 'Digital Education'],
      readTime: 7,
      views: 2150,
      likes: 156,
      comments: 28,
      featured: true,
      sourceAr: 'المعهد الوطني للتطوير المهني التعليمي',
      sourceEn: 'National Institute for Educational Professional Development'
    }
  ];

  const article = newsData.find(n => n.id === newsId);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-700 mb-4">
            {currentLang === 'ar' ? 'المقال غير موجود' : 'Article Not Found'}
          </h2>
          <button onClick={onBack} className="btn-primary">
            {t.backToNews}
          </button>
        </div>
      </div>
    );
  }

  const title = currentLang === 'ar' ? article.titleAr : article.titleEn;
  const content_text = currentLang === 'ar' ? article.contentAr : article.contentEn;
  const author = currentLang === 'ar' ? article.authorAr : article.authorEn;
  const category = currentLang === 'ar' ? article.categoryAr : article.categoryEn;
  const tags = currentLang === 'ar' ? article.tagsAr : article.tagsEn;
  const source = currentLang === 'ar' ? article.sourceAr : article.sourceEn;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return currentLang === 'ar' 
      ? date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const relatedNews = newsData.filter(n => n.id !== newsId).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
          >
            <ArrowIcon className="w-5 h-5" />
            {t.backToNews}
          </button>
        </div>
      </section>

      {/* Article Header */}
      <section className="bg-white section-spacing">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Category and Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                {category}
              </span>
              {article.featured && (
                <span className="bg-accent-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentLang === 'ar' ? 'مميز' : 'Featured'}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-700 mb-6 leading-tight">
              {title}
            </h1>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-secondary-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                <span>{t.publishedOn}: {formatDate(article.publishDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                <span>{t.author}: {author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-600" />
                <span>{article.readTime} {t.minutes}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary-600" />
                <span>{article.views} {t.views}</span>
              </div>
            </div>

            {/* Social Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-100 transition-colors duration-200">
                <ThumbsUp className="w-4 h-4" />
                <span>{article.likes} {t.likes}</span>
              </button>
              <button className="flex items-center gap-2 bg-secondary-50 text-secondary-700 px-4 py-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                <MessageCircle className="w-4 h-4" />
                <span>{article.comments} {t.comments}</span>
              </button>
              <button className="flex items-center gap-2 bg-accent-green-50 text-accent-green-700 px-4 py-2 rounded-lg hover:bg-accent-green-100 transition-colors duration-200">
                <Share2 className="w-4 h-4" />
                <span>{t.share}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Article Image */}
      <section className="bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <img 
              src={article.image}
              alt={title}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-white section-spacing">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <div 
                  className="prose prose-lg max-w-none text-secondary-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content_text }}
                  style={{
                    direction: currentLang === 'ar' ? 'rtl' : 'ltr'
                  }}
                />

                {/* Article Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm text-secondary-600">
                      <p>{t.lastUpdated}: {formatDate(article.lastUpdated)}</p>
                      <p>{t.source}: {source}</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="btn-secondary text-sm">
                        {t.print}
                      </button>
                      <button className="btn-secondary text-sm">
                        {t.downloadPDF}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  {/* Tags */}
                  <div className="card">
                    <h3 className="text-lg font-bold text-secondary-700 mb-4">{t.tags}</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-secondary-600 px-3 py-1 rounded-full text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200 cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="card">
                    <h3 className="text-lg font-bold text-secondary-700 mb-4">
                      {currentLang === 'ar' ? 'إجراءات' : 'Actions'}
                    </h3>
                    <div className="space-y-3">
                      <button className="btn-secondary w-full text-sm">
                        {t.contactAuthor}
                      </button>
                      <button className="btn-secondary w-full text-sm">
                        {t.reportIssue}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="section-spacing bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-secondary-700 mb-8 text-center">
                {t.relatedNews}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedNews.map((news) => {
                  const newsTitle = currentLang === 'ar' ? news.titleAr : news.titleEn;
                  const newsSummary = currentLang === 'ar' ? news.summaryAr : news.summaryEn;
                  const newsCategory = currentLang === 'ar' ? news.categoryAr : news.categoryEn;
                  
                  return (
                    <article key={news.id} className="card group hover:scale-[1.02] transition-all duration-300">
                      <div className="relative mb-4 overflow-hidden rounded-lg">
                        <img 
                          src={news.image}
                          alt={newsTitle}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {newsCategory}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-secondary-700 leading-tight line-clamp-2">
                          {newsTitle}
                        </h3>
                        <p className="text-secondary-600 text-sm leading-relaxed line-clamp-3">
                          {newsSummary}
                        </p>
                        <div className="flex items-center justify-between text-xs text-secondary-500">
                          <span>{formatDate(news.publishDate)}</span>
                          <span>{news.readTime} {t.minutes}</span>
                        </div>
                        <button className="btn-secondary w-full text-sm">
                          {t.readMore}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default NewsDetailPage;
