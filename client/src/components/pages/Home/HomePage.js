import React from 'react';
import { Link } from 'react-router-dom';
import AnchorLink from 'react-anchor-link-smooth-scroll';
export default function HomePage() {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  if (loading) {
    return (
      <div id='preloader'>
        <div class='loader' id='loader-1'></div>
      </div>
    );
  }

  const thisYear = new Date().getFullYear();
  return (
    <React.Fragment>
      {/*  */}
      <header id='header-wrap'>
        <div className=''>
          <nav class='navbar navbar-expand-md bg-inverse fixed-top scrolling-navbar'>
            <div class='container'>
              <Link
                to={'/'}
                onClick={() => window.scrollTo(0, 0)}
                class='navbar-brand'
              >
                <img height='50px' src='website/sutygon-03.png' alt='' />
              </Link>
              <button
                class='navbar-toggler'
                type='button'
                data-toggle='collapse'
                data-target='#navbarCollapse'
                aria-controls='navbarCollapse'
                aria-expanded='false'
                aria-label='Toggle navigation'
              >
                <i class='lni-menu'></i>
              </button>
              <div class='collapse navbar-collapse' id='navbarCollapse'>
                <ul class='navbar-nav ml-auto justify-content-end clearfix'>
                  <li class='nav-item activeNav'>
                    <a class='nav-link' href='#hero-area'>
                      Trang Chủ
                    </a>
                  </li>
                  <li class='nav-item'>
                    <a class='nav-link' href='#services'>
                      Dịch Vụ
                    </a>
                  </li>
                  {/* <li class="nav-item">
                  <a class="nav-link" href="#team">
                    Team
                  </a>
                </li> */}
                  <li class='nav-item'>
                    <a class='nav-link' href='#pricing'>
                      Bảng Giá
                    </a>
                  </li>
                  {/* <li class='nav-item'>
                    <a class='nav-link' href='#testimonial'>
                      Testimonial
                    </a>
                  </li> */}
                  <li class='nav-item'>
                    <a class='nav-link' href='#contact'>
                      Liên Hệ
                    </a>
                  </li>
                  <li class='nav-item'>
                    <Link class='nav-link' to={'/login'}>
                      Đăng Nhập
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <div id='hero-area' class='hero-area-bg'>
        <div class='container'>
          <div class='row'>
            <div class='col-lg-7 col-md-12 col-sm-12 col-xs-12'>
              <div class='contents'>
                <h2 class='head-title'>
                  {' '}
                  <span class='pink'>Hệ Thống Quản Lý Thuê Đồ</span> Hàng Đầu
                  Việt Nam
                </h2>
                <span class='d-flex'>
                  <span class='my-auto text-dark py-3'>
                    <span className='pink'>
                      <strong>Sutygon-Bot</strong>
                    </span>{' '}
                    ra đời để hiện đại hoá và tiện lợi hoá việc quản lý hàng
                    hoá, nhân viên, khách hàng, và đơn hàng trong lĩnh vực thuê
                    đồ. Với{' '}
                    <span className='pink'>
                      <strong>giá thành cực rẻ</strong>
                    </span>{' '}
                    kèm với nhiều tính năng hiện đại, hệ thống{' '}
                    <span className='pink'>
                      <strong>Sutygon-Bot</strong>
                    </span>{' '}
                    sẽ giúp công ty bạn vươn lên tầm cao mới.
                  </span>
                </span>
                <div class='header-button'>
                  <a
                    rel='nofollow'
                    href='https://www.sutygon.app/login'
                    class='btn1 btn1-common'
                  >
                    Đăng Nhập
                  </a>
                </div>
              </div>
            </div>
            <div class='col-lg-5 col-md-12 col-sm-12 col-xs-12'>
              <div class='intro-img'>
                <img
                  class='img-fluid'
                  src='website/img/intro-mobile.png'
                  alt=''
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id='services' class='section-padding'>
        <div class='container'>
          <div class='section-header text-center'>
            <h2 class='section-title wow fadeInDown' data-wow-delay='0.3s'>
              Dịch Vụ
            </h2>
            <div class='shape wow fadeInDown' data-wow-delay='0.3s'></div>
          </div>
          <div class='row'>
            <div class='col-md-6 col-lg-4 col-xs-12'>
              <div class='services-item wow fadeInRight' data-wow-delay='0.3s'>
                <div class='icon'>
                  <i class='lni-cog'></i>
                </div>
                <div class='services-content'>
                  <h3>
                    <a href='#'>Quản Lý Cửa Hàng</a>
                  </h3>
                  <p>
                    Bạn có thể sử dụng phần mềm với nhiều cửa hàng khác nhau,
                    vỡi hệ thống lưu trữ thông tin tách biệt.
                  </p>
                </div>
              </div>
            </div>
            <div class='col-md-6 col-lg-4 col-xs-12'>
              <div class='services-item wow fadeInRight' data-wow-delay='0.6s'>
                <div class='icon'>
                  <i class='lni-stats-up'></i>
                </div>
                <div class='services-content'>
                  <h3>
                    <a href='#'>Quản Lý Hàng Kho</a>
                  </h3>
                  <p>
                    Hệ thống hàng kho đa đụng, giúp bạn quản lý với tags, mã
                    barcode, cùng nhiều phương thức khác.
                  </p>
                </div>
              </div>
            </div>
            <div class='col-md-6 col-lg-4 col-xs-12'>
              <div class='services-item wow fadeInRight' data-wow-delay='0.9s'>
                <div class='icon'>
                  <i class='lni-calendar'></i>
                </div>
                <div class='services-content'>
                  <h3>
                    <a href='#'>Quản Lý Nhân Viên</a>
                  </h3>
                  <p>
                    Bạn có thể cài đặc quyền hạn cho nhân viên để nhân viên chỉ
                    sử dụng các tính năng cần thiết, tiện lợi cho việc quản lý.
                  </p>
                </div>
              </div>
            </div>
            <div class='col-md-6 col-lg-4 col-xs-12'>
              <div class='services-item wow fadeInRight' data-wow-delay='1.2s'>
                <div class='icon'>
                  <i class='lni-layers'></i>
                </div>
                <div class='services-content'>
                  <h3>
                    <a href='#'>Quản Lý Hóa Đơn</a>
                  </h3>
                  <p>
                    Bạn có thể dễ dàng truy cập và quản lý hóa đơn khách hàng từ
                    mọi nơi, tại mọi thời điểm.
                  </p>
                </div>
              </div>
            </div>
            <div class='col-md-6 col-lg-4 col-xs-12'>
              <div class='services-item wow fadeInRight' data-wow-delay='1.5s'>
                <div class='icon'>
                  <i class='lni-laptop-phone'></i>
                </div>
                <div class='services-content'>
                  <h3>
                    <a href='#'>Tích Hợp API</a>
                  </h3>
                  <p>
                    Bạn có thể tạo phần mềm chuyên dụng cho công ty mình và tích
                    hợp API Sutygon-Bot để tự lập trình các tính năng riêng
                    biệt.
                  </p>
                </div>
              </div>
            </div>
            <div class='col-md-6 col-lg-4 col-xs-12'>
              <div class='services-item wow fadeInRight' data-wow-delay='1.8s'>
                <div class='icon'>
                  <i class='lni-rocket'></i>
                </div>
                <div class='services-content'>
                  <h3>
                    <a href='#'>Hỗ Trợ Ban Đầu</a>
                  </h3>
                  <p>
                    Khi mới đăng ký sử dụng hệ thống Sutygon-Bot, chúng tôi sẽ
                    tận tình giúp đỡ bạn với giai đoạn tập huấn để bạn có thể
                    bắt đầu sử dụng hệ thống nhanh chóng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* about */}
      <div class='about-area section-padding bg-gray'>
        <div class='container'>
          <div class='row'>
            <div class='col-lg-6 col-md-12 col-xs-12 info'>
              <div class='about-wrapper wow fadeInLeft' data-wow-delay='0.3s'>
                <div>
                  <div class='site-heading'>
                    <h2 class='section-title'>
                      Nâng xuất công ty bạn{' '}
                      <span class='font-weight-bold pink'>
                        lên tầm cao mới!
                      </span>
                    </h2>
                  </div>
                  <div class='content'>
                    <p class='text-dark'>
                      Không còn phải lo lắng nhọc nhằn với giấy tờ bừa bộn, hóa
                      đơn chồng chất nữa. Bởi vì bạn nên để công sức mà phát
                      triển công ty, những công việc bên lề như quản lý hóa đơn
                      và khách hàng cứ để Sutygon-Bot lo :-D
                    </p>
                    <a href='/login' class='btn1 btn1-common mt-3'>
                      Tạo Tài Khoản Miễn Phí
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              class='col-lg-6 col-md-12 col-xs-12 wow fadeInRight'
              data-wow-delay='0.3s'
            >
              <img class='img-fluid' src='website/img/about/img-1.png' alt='' />
            </div>
          </div>
        </div>
      </div>
      {/* feature */}
      <section id='features' class='section-padding'>
        <div class='container'>
          <div class='section-header text-center'>
            <h2 class='section-title wow fadeInDown' data-wow-delay='0.3s'>
              Tính Năng Hiện Đại
            </h2>
            <div class='shape wow fadeInDown' data-wow-delay='0.3s'></div>
          </div>
          <div class='row'>
            <div class='col-lg-4 col-md-12 col-sm-12 col-xs-12'>
              <div class='content-left'>
                <div class='box-item wow fadeInLeft' data-wow-delay='0.3s'>
                  <span class='icon'>
                    <i class='lni-rocket'></i>
                  </span>
                  <div class='text1'>
                    <h4>Công Nghệ MERN Stack</h4>
                    <p>
                      Sử dụng công nghệ React hiện đại cũng như lưu trữ thông
                      tin trên MongoDB để có thể cung cấp cho bạn dịch vụ nhanh,
                      bảo mật, và hợp túi tiền.
                    </p>
                  </div>
                </div>
                <div class='box-item wow fadeInLeft' data-wow-delay='0.6s'>
                  <span class='icon'>
                    <i class='lni-laptop-phone'></i>
                  </span>
                  <div class='text1'>
                    <h4>Hệ Thống Barcode</h4>
                    <p>
                      Quản lý hàng kho với hệ thống barcode để tiện lợi giám sát
                      từng sản phẩm một cách chi tiết, cắt giảm thời gian ghi
                      sổ, giảm thiểu sai sót từ con người.
                    </p>
                  </div>
                </div>
                <div class='box-item wow fadeInLeft' data-wow-delay='0.9s'>
                  <span class='icon'>
                    <i class='lni-cog'></i>
                  </span>
                  <div class='text1'>
                    <h4>Cá Nhân Hóa Quyền Hạn</h4>
                    <p>
                      Không phải chức vụ nào cũng cần quyền truy cập giống nhau.
                      Bạn có thể cá nhân hoá quyền hạn cho các tài khoản nhân
                      viên để tránh nhân viên truy cập thông tin không ủy quyền.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class='col-lg-4 col-md-12 col-sm-12 col-xs-12'>
              <div class='show-box wow fadeInUp' data-wow-delay='0.3s'>
                <img src='website/img/feature/intro-mobile.png' alt='' />
              </div>
            </div>
            <div class='col-lg-4 col-md-12 col-sm-12 col-xs-12'>
              <div class='content-right'>
                <div class='box-item wow fadeInRight' data-wow-delay='0.3s'>
                  <span class='icon'>
                    <i class='lni-map-marker'></i>
                  </span>
                  <div class='text1'>
                    <h4>Lịch Sử Giao Dịch</h4>
                    <p>
                      Giám sát lịch sử hoạt động của công ty từ lúc mở cửa cho
                      đến lúc đống cửa. Hệ thống sẽ cho bạn biết số lượng giao
                      dịch, các thành viên giao dịch cũng như nhiều thông tin bổ
                      ích khác.
                    </p>
                  </div>
                </div>
                <div class='box-item wow fadeInRight' data-wow-delay='0.6s'>
                  <span class='icon'>
                    <i class='lni-layers'></i>
                  </span>
                  <div class='text1'>
                    <h4>Chu Kỳ Đơn Hàng</h4>
                    <p>
                      Cấu trúc quản lý chu kỳ một chiều giúp giảm thiểu sai sót
                      trong quá trình chuẩn bị, giao đơn, trả đơn và thanh toán
                      phí cho mỗi đơn hàng.
                    </p>
                  </div>
                </div>
                <div class='box-item wow fadeInRight' data-wow-delay='0.9s'>
                  <span class='icon'>
                    <i class='lni-calendar'></i>
                  </span>
                  <div class='text1'>
                    <h4>Luôn Nâng Cấp</h4>
                    <p>
                      Từ đặt hẹn online, tạo mã giảm giá, cho đến nhiều tính
                      năng mới luôn được cập nhật thường xuyên. Bởi vì cuộc sống
                      luôn đổi mới, và công nghệ thông tin cũng vậy :-D
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* pricing */}

      <section id='pricing' class='section-padding'>
        <div class='container'>
          <div class='section-header text-center'>
            <h2
              class='section-title wow fadeInDown'
              id='price'
              data-wow-delay='0.3s'
            >
              Bảng Giá
            </h2>
            <div class='shape wow fadeInDown' data-wow-delay='0.3s'></div>
          </div>
          <div class='row justify-content-center'>
            <div class='col-lg-4 col-md-6 col-xs-12'>
              <div
                class='table wow  px-2 text-center fadeInLeft'
                data-wow-delay='1.2s'
              >
                <div class='icon-box'>
                  <i class='lni-package'></i>
                </div>
                <div class='pricing-header'>
                  <p class='price-value'>Miễn Phí</p>
                  <span>100 Đơn Hàng Mỗi Tháng </span>
                </div>
                <div class='title'></div>
                <ul class='description px-3'>
                  <li style={{ color: '#fa0095' }}>2 Tài Khoản Quản Lý</li>
                  <li style={{ color: '#fa0095' }}>5 Tài Khoản Nhân Viên</li>
                  <li>Không thể tạo mã giảm giá</li>
                  <li>Không thể đặt hẹn</li>
                  <li>Không logo riêng</li>
                  <li>Chăm sóc khách hàng hạng thường</li>
                </ul>
                <button class='btn1 btn1-common'>Chọn Gói Này</button>
              </div>
            </div>
            <div class='col-lg-4 col-md-6 col-xs-12 activeNav'>
              <div
                class='table wow  px-2 text-center fadeInUp'
                id='active-tb'
                data-wow-delay='1.2s'
              >
                <div class='icon-box'>
                  <i class='lni-drop'></i>
                </div>
                <div class='pricing-header'>
                  <p class='price-value'>
                    150 000
                    <span> VNĐ mỗi tháng</span>
                  </p>

                  <span>300 Đơn Hàng Mỗi Tháng</span>
                </div>

                <ul class='description px-3 pt-3'>
                  <li style={{ color: '#fa0095' }}>5 Tài Khoản Quản Lý</li>
                  <li style={{ color: '#fa0095' }}>10 Tài Khoản Nhân Viên</li>
                  <li style={{ color: '#fa0095' }}>Tạo Mã Giảm Giá</li>
                  <li style={{ color: '#fa0095' }}>Cho Khách Đặt Hẹn</li>
                  <li style={{ color: '#fa0095' }}>Xài Logo Riêng</li>
                  <li>Chăm sóc khách hàng hạng thường</li>
                </ul>
                <button class='btn1 btn1-common'>Chọn Gói Này</button>
              </div>
            </div>
            <div class='col-lg-4 col-md-6 col-xs-12'>
              <div
                class='table wow  px-2 text-center fadeInRight'
                data-wow-delay='1.2s'
              >
                <div class='icon-box'>
                  <i class='lni-star'></i>
                </div>
                <div class='pricing-header'>
                  <p class='price-value'>
                    300 000
                    <span> VNĐ mỗi tháng</span>
                  </p>

                  <span>600 Đơn Hàng Mỗi Tháng</span>
                </div>
                {/* <div class="title">
                  <h3>Premium</h3>
                </div> */}
                <ul class='description px-3 pt-3'>
                  <li style={{ color: '#fa0095' }}>8 Tài Khoản Quản Lý</li>
                  <li style={{ color: '#fa0095' }}>15 Tài Khoản Nhân Viên</li>
                  <li style={{ color: '#fa0095' }}>Tạo Mã Giảm Giá</li>
                  <li style={{ color: '#fa0095' }}>Cho Khách Đặt Hẹn</li>
                  <li style={{ color: '#fa0095' }}>Xài Logo Riêng</li>
                  <li style={{ color: '#fa0095' }}>
                    Ưu Tiên Chăm Sóc Khách Hàng
                  </li>
                </ul>
                <button class='btn1 btn1-common'>Chọn Gói Này</button>
              </div>
            </div>
            <div class='col-md-6 col-xs-12'>
              <div
                class='table wow  px-2 text-center fadeInRight'
                data-wow-delay='1.2s'
              >
                <div class='pricing-header'>
                  <p class='price-value'>
                    <span>
                      Hơn {''}
                      <span style={{ color: '#fa0095' }}>
                        600 đơn hàng mỗi tháng
                      </span>
                      ? Liên hệ chúng tôi!
                    </span>
                  </p>
                </div>
                {/* <div class="title">
                  <h3>Premium</h3>
                </div> */}
                <ul class='description px-0'>
                  <li>
                    Thêm tài khoản Quản Lý hay tài khoản Nhân Viên cho gói của
                    bạn? Chỉ{' '}
                    <span style={{ color: '#fa0095' }}>10 000 VNĐ</span> cho mỗi
                    tài khoản thêm.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section id="cta" class="section-padding">
        <div class="container">
          <div class="row">
            <div
              class="col-lg-6 col-md-6 col-xs-12 wow fadeInLeft"
              data-wow-delay="0.3s"
            >
              <div class="cta-text1">
                <h4>Try SUTYGON-BOT</h4>
                <p>* Over 600 order/month please contact directly.</p>
              </div>
            </div>
            <div
              class="col-lg-6 col-md-6 col-xs-12 text-right wow fadeInRight"
              data-wow-delay="0.3s"
            >
              <br />
              <a href="#" class="btn1 btn1-common">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section> */}
      {/* testimonal */}
      <section id='testimonial' class='testimonial section-padding'>
        <div class='container'>
          <div class='row justify-content-center'>
            <div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div
                id='testimonials'
                class='owl-carousel wow fadeInUp'
                data-wow-delay='1.2s'
              >
                <div class='item'>
                  <div class='testimonial-item'>
                    <div class='img-thumb'>
                      <img src='website/img/testimonial/img1.jpg' alt='' />
                    </div>
                    <div class='info'>
                      <h2>
                        <a href='#'>David Smith</a>
                      </h2>
                      <h3>
                        <a href='#'>Creative Head</a>
                      </h3>
                    </div>
                    <div class='content'>
                      <p class='description'>
                        Praesent cursus nulla non arcu tempor, ut egestas elit
                        tempus. In ac ex fermentum, gravida felis nec, tincidunt
                        ligula.
                      </p>
                      <div class='star-icon mt-3'>
                        <span>
                          <i class='lni-star-filled'></i>
                        </span>
                        <span>
                          <i class='lni-star-filled'></i>
                        </span>
                        <span>
                          <i class='lni-star-filled'></i>
                        </span>
                        <span>
                          <i class='lni-star-filled'></i>
                        </span>
                        <span>
                          <i class='lni-star-half'></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class='item'>
                  <div class='testimonial-item'>
                    <div class='img-thumb'>
                      <img src='website/img/testimonial/img2.jpg' alt='' />
                    </div>
                    <div class='info'>
                      <h2>
                        <a href='#'>Domeni GEsson</a>
                      </h2>
                      <h3>
                        <a href='#'>Awesome Technology co.</a>
                      </h3>
                    </div>
                    <div class='content'>
                      <p class='description'>
                        Praesent cursus nulla non arcu tempor, ut egestas elit
                        tempus. In ac ex fermentum, gravida felis nec, tincidunt
                        ligula.
                      </p>
                      <div class='star-icon mt-3'>
                        <span>
                          <i class='lni-star-filled'></i>
                        </span>
                        <span>
                          <i class='lni-star-filled'></i>
                        </span>
                        <span>
                          <i class='lni-star-filled'></i>
                        </span>
                        <span>
                          <i class='lni-star-half'></i>
                        </span>
                        <span>
                          <i class='lni-star-half'></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class='item'>
                  <div class='testimonial-item'>
                    <div class='img-thumb'>
                      <img src='website/img/testimonial/img3.jpg' alt='' />
                    </div>
                    <div class='info'>
                      <h2>
                        <a href='#'>Dommini Albert</a>
                      </h2>
                      <h3>
                        <a href='#'>Nesnal Design co.</a>
                      </h3>
                    </div>
                    <div class='content'>
                      <p class='description'>
                        Praesent cursus nulla non arcu tempor, ut egestas elit
                        tempus. In ac ex fermentum, gravida felis nec, tincidunt
                        ligula.
                      </p>
                      <div class='star-icon mt-3'>
                        <span>
                          <i class='lni-star-filled'></i>
                        </span>
                        <span>
                          <i class='lni-star-filled'></i>
                        </span>
                        <span>
                          <i class='lni-star-filled'></i>
                        </span>
                        <span>
                          <i class='lni-star-filled'></i>
                        </span>
                        <span>
                          <i class='lni-star-half'></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class='item'>
                  <div class='testimonial-item'>
                    <div class='img-thumb'>
                      <img src='website/img/testimonial/img4.jpg' alt='' />
                    </div>
                    <div class='info'>
                      <h2>
                        <a href='#'>Fernanda Anaya</a>
                      </h2>
                      <h3>
                        <a href='#'>Developer</a>
                      </h3>
                    </div>
                    <div class='content'>
                      <p class='description'>
                        Praesent cursus nulla non arcu tempor, ut egestas elit
                        tempus. In ac ex fermentum, gravida felis nec, tincidunt
                        ligula.
                      </p>
                      <div class='star-icon mt-3'>
                        <span>
                          <i class='lni-star-filled'></i>
                        </span>
                        <span>
                          <i class='lni-star-filled'></i>
                        </span>
                        <span>
                          <i class='lni-star-half'></i>
                        </span>
                        <span>
                          <i class='lni-star-half'></i>
                        </span>
                        <span>
                          <i class='lni-star-half'></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* call to action */}

      {/* contact form */}

      <section id='contact' class='section-padding bg-gray'>
        <div class='container'>
          <div class='section-header text-center'>
            <h2 class='section-title wow fadeInDown' data-wow-delay='0.3s'>
              Liên Hệ
            </h2>
            <div class='shape wow fadeInDown' data-wow-delay='0.3s'></div>
          </div>
          <div class='row contact-form-area wow fadeInUp' data-wow-delay='0.3s'>
            <div class='col-lg-6 col-md-12 col-sm-12'>
              {/* <!-- Call To Action Section Start --> */}
              <section id='cta' class='section-padding'>
                <div class='container'>
                  <div class='row'>
                    <div
                      class='col-lg-10 col-md-10 col-xs-12 wow fadeInLeft'
                      data-wow-delay='0.3s'
                    >
                      <form>
                        <div class='form-group'>
                          <input
                            type='text1'
                            class='form-control'
                            id='exampleInputEmail1'
                            aria-describedby='emailHelp'
                            placeholder='Họ Và Tên'
                          />
                        </div>
                        <div class='form-group'>
                          <input
                            type='email'
                            class='form-control'
                            id='exampleInputEmail1'
                            aria-describedby='emailHelp'
                            placeholder='Email của bạn là gì?'
                          />
                        </div>
                        <div class='form-group'>
                          <input
                            type='text1'
                            class='form-control'
                            id='exampleInputEmail1'
                            aria-describedby='emailHelp'
                            placeholder='Số Điện Thoại của bạn?'
                          />
                        </div>
                        <textarea
                          class='contactfieldarea'
                          type='text1'
                          name='msg'
                          placeholder='Tin nhắn cho chúng tôi. Thử "Sutygon-Bot thật là tuyệt vời!"'
                          required=''
                        ></textarea>
                        <button type='submit' class='btn1 btn1-common'>
                          Gửi Tin Nhắn
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div class='col-lg-6 col-md-12 col-xs-12'>
              <div class='map h-100'>
                <object
                  style={{ border: '0', height: '100%', width: '100%' }}
                  data='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d265.86971216709503!2d108.22082824627441!3d16.073603906033025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421830c46676cf%3A0xce6fa96861311b1f!2zNzZiIE5ndXnhu4VuIENow60gVGhhbmgsIEjhuqNpIENow6J1IDEsIEjhuqNpIENow6J1LCDEkMOgIE7hurVuZyA1NTAwMDAsIFZpZXRuYW0!5e0!3m2!1sen!2sus!4v1615185158496!5m2!1sen!2sus'
                ></object>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* footer section */}
      <footer id='footer' class='footer-area section-padding'>
        <div class='container'>
          <div class='container'>
            <div class='row'>
              <div class='col-lg-3 col-md-6 col-sm-6 col-xs-6 col-mb-12'>
                <div class='widget'>
                  <h3 class='footer-logo'>
                    <img src='website/logo.png' height='100px' alt='' />
                  </h3>
                  <div class='textwidget'>
                    <p>
                      Thiết Kế & Lập Trình <br />
                      Calum Nguyen
                    </p>
                  </div>
                  <div class='social-icon'>
                    <a class='facebook' href='#'>
                      <i class='lni-facebook-filled'></i>
                    </a>
                    <a class='twitter' href='#'>
                      <i class='lni-twitter-filled'></i>
                    </a>
                    <a class='instagram' href='#'>
                      <i class='lni-instagram-filled'></i>
                    </a>
                    <a class='linkedin' href='#'>
                      <i class='lni-linkedin-filled'></i>
                    </a>
                  </div>
                </div>
              </div>
              <div class='col-lg-3 col-md-6 col-sm-12 col-xs-12'>
                <h3 class='footer-titel'>Khách Hàng</h3>
                <ul class='footer-link'>
                  <li>
                    <a href='https://www.dropscandies.com/' target='_blank'>
                      Drops USA
                    </a>
                  </li>
                  <li>
                    <a href='https://www.the-interpreter.org/' target='_blank'>
                      The-Intepretor
                    </a>
                  </li>
                  <li>
                    <a href='https://www.sutygon.com/' target='_blank'>
                      Trang Phục Biểu Diễn Sutygôn
                    </a>
                  </li>
                </ul>
              </div>
              <div class='col-lg-3 col-md-6 col-sm-12 col-xs-12'>
                <h3 class='footer-titel'>Thông Tin</h3>
                <ul class='footer-link'>
                  <li>
                    <a href='#'>Câu Hỏi Thường Gặp</a>
                  </li>
                  <li>
                    <a href='#'>Phương Thức Thanh Toán</a>
                  </li>
                  <li>
                    <a href='#'>Trở Thành Nhà Đầu Tư</a>
                  </li>
                  {/* <li>
                  <a href='#'>sds</a>
                  </li> */}
                </ul>
              </div>
              <div class='col-lg-3 col-md-6 col-sm-12 col-xs-12'>
                <h3 class='footer-titel'>Liên Hệ</h3>
                <ul class='address'>
                  <li>
                    <a href='#'>
                      <i class='lni-map-marker'></i> 76B Nguyễn Chí Thanh, Hải
                      Châu, Đà Nẵng.
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i class='lni-phone-handset'></i> P: +84 905 923 149
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i class='lni-envelope'></i> E: supervisor@sutygon.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div id='copyright'>
          <div class='container'>
            <div class='row'>
              <div class='col-md-12'>
                <div class='copyright-content'>
                  <p>
                    Bản Quyền
                    <a
                      class='px-2'
                      rel='nofollow'
                      href='https://www.sutygon.app/login'
                    >
                      SUTYGON-BOT.
                    </a>
                    Cập Nhật {thisYear}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* Go to Top Link */}
      <a href='#' class='back-to-top'>
        <i class='lni-arrow-up'></i>
      </a>
      {/* preloader */}
      {/* <div id="preloader">
        <div class="loader" id="loader-1"></div>
      </div> */}
    </React.Fragment>
  );
}
