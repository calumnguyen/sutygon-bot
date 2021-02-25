import React from "react";
import { Link } from "react-router-dom";
export default function HomePage() {
  const [loading,setLoading]=React.useState(true)
  React.useEffect(() => 
  {
    window.scrollTo(0, 0)
    setTimeout(() => {
      setLoading(false)
    },1000)
  }
  
    , []);
  if (loading) {
    return (<div id="preloader">
        <div class="loader" id="loader-1"></div>
      </div>)
  }
  return (
    <React.Fragment>
       {/*  */}
      <header id="header-wrap">
        <div className="">
          <nav class="navbar navbar-expand-md bg-inverse fixed-top scrolling-navbar">
          <div class="container">
            <Link
              to={"/"}
              onClick={() => window.scrollTo(0, 0)}
              class="navbar-brand"
            >
              <img height="100px" src="website/sutygon-03.png" alt="" />
            </Link>
            <button
              class="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i class="lni-menu"></i>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
              <ul class="navbar-nav ml-auto justify-content-end clearfix">
                <li class="nav-item activeNav">
                  <a class="nav-link" href="#hero-area">
                    Home
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#services">
                    Services
                  </a>
                </li>
                {/* <li class="nav-item">
                  <a class="nav-link" href="#team">
                    Team
                  </a>
                </li> */}
                <li class="nav-item">
                  <a class="nav-link" href="#pricing">
                    Pricing
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#testimonial">
                    Testimonial
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#contact">
                    Contact
                  </a>
                </li>
                 <li class="nav-item">
                  <Link class="nav-link" to={"/login"}>
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        </div>
        </header>
        <div id="hero-area" class="hero-area-bg">
          <div class="container">
            <div class="row">
              <div class="col-lg-7 col-md-12 col-sm-12 col-xs-12">
                <div class="contents">
                  <h2 class="head-title">
                    {" "}
                    <span class="pink">Digitalization</span> Plan of Action
                  </h2>
                  <span class="d-flex">
                    <span class="my-auto text-dark">
                      At Sutygon-Bot, our mission is to develop a fully customer
                      centric company; to develop a junction where anyone can
                      join to find and discover anything they want to take on
                      rental. SutyGon-Bot is an online rental service whose primary
                      aim is to support its customers as it makes surplus rental
                      services easy on customers? pockets, which otherwise
                      exceeds the affordability of a normal person.
                    </span>
                  </span>
                  <div class="header-button">
                    <a
                      rel="nofollow"
                      href="https://www.sutygon.app/"
                      class="btn1 btn1-common"
                    >
                      Get started
                    </a>
                  </div>
                </div>
              </div>
              <div class="col-lg-5 col-md-12 col-sm-12 col-xs-12">
                <div class="intro-img">
                  <img
                    class="img-fluid"
                    src="website/img/intro-mobile.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
     

      <section id="services" class="section-padding">
        <div class="container">
          <div class="section-header text-center">
            <h2 class="section-title wow fadeInDown" data-wow-delay="0.3s">
              Our Services
            </h2>
            <div class="shape wow fadeInDown" data-wow-delay="0.3s"></div>
          </div>
          <div class="row">
            <div class="col-md-6 col-lg-4 col-xs-12">
              <div class="services-item wow fadeInRight" data-wow-delay="0.3s">
                <div class="icon">
                  <i class="lni-cog"></i>
                </div>
                <div class="services-content">
                  <h3>
                    <a href="#">Order management</a>
                  </h3>
                  <p>
                    Let your team create and manage orders, and always be
                    prepared for customer pickups and returns.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4 col-xs-12">
              <div class="services-item wow fadeInRight" data-wow-delay="0.6s">
                <div class="icon">
                  <i class="lni-stats-up"></i>
                </div>
                <div class="services-content">
                  <h3>
                    <a href="#">Contracts</a>
                  </h3>
                  <p>
                    Create contracts and confirm your rental agreements by
                    letting your customers sign digitally.{" "}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4 col-xs-12">
              <div class="services-item wow fadeInRight" data-wow-delay="0.9s">
                <div class="icon">
                  <i class="lni-calendar"></i>
                </div>
                <div class="services-content">
                  <h3>
                    <a href="#">Availability calendar</a>
                  </h3>
                  <p>
                    Zoom in on specific products, spot potential conflicts, and
                    quickly check availability for any date range.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4 col-xs-12">
              <div class="services-item wow fadeInRight" data-wow-delay="1.2s">
                <div class="icon">
                  <i class="lni-layers"></i>
                </div>
                <div class="services-content">
                  <h3>
                    <a href="#">Document templates</a>
                  </h3>
                  <p>
                    Enjoy customizable templates for quotes, contracts, and
                    invoices. Easily add your own branding.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4 col-xs-12">
              <div class="services-item wow fadeInRight" data-wow-delay="1.5s">
                <div class="icon">
                  <i class="lni-laptop-phone"></i>
                </div>
                <div class="services-content">
                  <h3>
                    <a href="#">Dashboard</a>
                  </h3>
                  <p>
                    Get a single view of upcoming pickups and returns so you’re
                    always ready for the next rental.{" "}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4 col-xs-12">
              <div class="services-item wow fadeInRight" data-wow-delay="1.8s">
                <div class="icon">
                  <i class="lni-rocket"></i>
                </div>
                <div class="services-content">
                  <h3>
                    <a href="#">Invoicing</a>
                  </h3>
                  <p>
                    Invoices are synced with your orders to reduce human error
                    and put your invoicing on autopilot.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* about */}
      <div class="about-area section-padding bg-gray">
        <div class="container">
          <div class="row">
            <div class="col-lg-6 col-md-12 col-xs-12 info">
              <div class="about-wrapper wow fadeInLeft" data-wow-delay="0.3s">
                <div>
                  <div class="site-heading">
                    <h2 class="section-title">
                      We are Always{" "}
                      <span class="font-weight-bold pink"> be ready</span> for
                      our customers
                    </h2>
                  </div>
                  <div class="content">
                    <p class="text-dark">
                      We are dedicated to ensure 100% genuine products for your
                      renting done on rentone. in, enabling you to leverage an
                      absolutely safe and secure online renting experience, easy
                      and convenient payment options, and easy delivery and
                      returns.
                    </p>
                    <a href="#" class="btn1 btn1-common mt-3">
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="col-lg-6 col-md-12 col-xs-12 wow fadeInRight"
              data-wow-delay="0.3s"
            >
              <img class="img-fluid" src="website/img/about/img-1.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      {/* feature */}
      <section id="features" class="section-padding">
        <div class="container">
          <div class="section-header text-center">
            <h2 class="section-title wow fadeInDown" data-wow-delay="0.3s">
              Awesome Features
            </h2>
            <div class="shape wow fadeInDown" data-wow-delay="0.3s"></div>
          </div>
          <div class="row">
            <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <div class="content-left">
                <div class="box-item wow fadeInLeft" data-wow-delay="0.3s">
                  <span class="icon">
                    <i class="lni-rocket"></i>
                  </span>
                  <div class="text1">
                    <h4>Invoicing</h4>
                    <p>
                      Invoices are synced with your orders to reduce human error
                      and put your invoicing on autopilot.
                    </p>
                  </div>
                </div>
                <div class="box-item wow fadeInLeft" data-wow-delay="0.6s">
                  <span class="icon">
                    <i class="lni-laptop-phone"></i>
                  </span>
                  <div class="text1">
                    <h4>Dashboard</h4>
                    <p>
                      Get a single view of upcoming pickups and returns so
                      you’re always ready for the next rental.
                    </p>
                  </div>
                </div>
                <div class="box-item wow fadeInLeft" data-wow-delay="0.9s">
                  <span class="icon">
                    <i class="lni-cog"></i>
                  </span>
                  <div class="text1">
                    <h4>ORDER MANAGEMENT</h4>
                    <p>
                      Let your team create and manage orders, and always be
                      prepared for customer pickups and returns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <div class="show-box wow fadeInUp" data-wow-delay="0.3s">
                <img src="website/img/feature/intro-mobile.png" alt="" />
              </div>
            </div>
            <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <div class="content-right">
                <div class="box-item wow fadeInRight" data-wow-delay="0.3s">
                  <span class="icon">
                    <i class="lni-map-marker"></i>
                  </span>
                  <div class="text1">
                    <h4>Trackable inventory</h4>
                    <p>
                      Keep detailed track of stock by using unique identifiers
                      such as serial numbers or barcodes.
                    </p>
                  </div>
                </div>
                <div class="box-item wow fadeInRight" data-wow-delay="0.6s">
                  <span class="icon">
                    <i class="lni-layers"></i>
                  </span>
                  <div class="text1">
                    <h4>DOCUMENT TEMPLATES</h4>
                    <p>
                      Enjoy customizable templates for quotes, contracts, and
                      invoices. Easily add your own branding.
                    </p>
                  </div>
                </div>
                <div class="box-item wow fadeInRight" data-wow-delay="0.9s">
                  <span class="icon">
                    <i class="lni-calendar"></i>
                  </span>
                  <div class="text1">
                    <h4>Availability calendar</h4>
                    <p>
                      Zoom in on specific products, spot potential conflicts,
                      and quickly check availability for any date range.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* pricing */}

      <section id="pricing" class="section-padding">
        <div class="container">
          <div class="section-header text-center">
            <h2 class="section-title wow fadeInDown" data-wow-delay="0.3s">
              Pricing
            </h2>
            <div class="shape wow fadeInDown" data-wow-delay="0.3s"></div>
          </div>
          <div class="row">
            <div class="col-lg-4 col-md-6 col-xs-12">
              <div class="table wow fadeInLeft" data-wow-delay="1.2s">
                <div class="icon-box">
                  <i class="lni-package"></i>
                </div>
                <div class="pricing-header">
                  <p class="price-value">
                    10000<span> VND</span>
                  </p>
                </div>
                <div class="title">
                  <h3>Pro</h3>
                </div>
                <ul class="description">
                  <li>
                    per week, billed monthally or 350000 VND per week, billed
                    weekly
                  </li>
                </ul>
                <button class="btn1 btn1-common">GET NOW</button>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-xs-12 activeNav">
              <div
                class="table wow fadeInUp"
                id="active-tb"
                data-wow-delay="1.2s"
              >
                <div class="icon-box">
                  <i class="lni-drop"></i>
                </div>
                <div class="pricing-header">
                  <p class="price-value">
                    35000<span> VND</span>
                  </p>
                </div>
                <div class="title">
                  <h3>Plus</h3>
                </div>
                <ul class="description">
                  <li>
                    per week, billed monthally or 95000 VND per week, billed
                    weekly
                  </li>
                </ul>
                <button class="btn1 btn1-common">GET NOW</button>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-xs-12">
              <div class="table wow fadeInRight" data-wow-delay="1.2s">
                <div class="icon-box">
                  <i class="lni-star"></i>
                </div>
                <div class="pricing-header">
                  <p class="price-value">
                    150<span> VND</span>
                  </p>
                </div>
                <div class="title">
                  <h3>Premium</h3>
                </div>
                <ul class="description">
                  <li>
                    per week, billed monthally or 299000 VND per week, billed
                    weekly
                  </li>
                </ul>
                <button class="btn1 btn1-common">GET NOW</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* testimonal */}
      <section id="testimonial" class="testimonial section-padding">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div
                id="testimonials"
                class="owl-carousel wow fadeInUp"
                data-wow-delay="1.2s"
              >
                <div class="item">
                  <div class="testimonial-item">
                    <div class="img-thumb">
                      <img src="website/img/testimonial/img1.jpg" alt="" />
                    </div>
                    <div class="info">
                      <h2>
                        <a href="#">David Smith</a>
                      </h2>
                      <h3>
                        <a href="#">Creative Head</a>
                      </h3>
                    </div>
                    <div class="content">
                      <p class="description">
                        Praesent cursus nulla non arcu tempor, ut egestas elit
                        tempus. In ac ex fermentum, gravida felis nec, tincidunt
                        ligula.
                      </p>
                      <div class="star-icon mt-3">
                        <span>
                          <i class="lni-star-filled"></i>
                        </span>
                        <span>
                          <i class="lni-star-filled"></i>
                        </span>
                        <span>
                          <i class="lni-star-filled"></i>
                        </span>
                        <span>
                          <i class="lni-star-filled"></i>
                        </span>
                        <span>
                          <i class="lni-star-half"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item">
                  <div class="testimonial-item">
                    <div class="img-thumb">
                      <img src="website/img/testimonial/img2.jpg" alt="" />
                    </div>
                    <div class="info">
                      <h2>
                        <a href="#">Domeni GEsson</a>
                      </h2>
                      <h3>
                        <a href="#">Awesome Technology co.</a>
                      </h3>
                    </div>
                    <div class="content">
                      <p class="description">
                        Praesent cursus nulla non arcu tempor, ut egestas elit
                        tempus. In ac ex fermentum, gravida felis nec, tincidunt
                        ligula.
                      </p>
                      <div class="star-icon mt-3">
                        <span>
                          <i class="lni-star-filled"></i>
                        </span>
                        <span>
                          <i class="lni-star-filled"></i>
                        </span>
                        <span>
                          <i class="lni-star-filled"></i>
                        </span>
                        <span>
                          <i class="lni-star-half"></i>
                        </span>
                        <span>
                          <i class="lni-star-half"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item">
                  <div class="testimonial-item">
                    <div class="img-thumb">
                      <img src="website/img/testimonial/img3.jpg" alt="" />
                    </div>
                    <div class="info">
                      <h2>
                        <a href="#">Dommini Albert</a>
                      </h2>
                      <h3>
                        <a href="#">Nesnal Design co.</a>
                      </h3>
                    </div>
                    <div class="content">
                      <p class="description">
                        Praesent cursus nulla non arcu tempor, ut egestas elit
                        tempus. In ac ex fermentum, gravida felis nec, tincidunt
                        ligula.
                      </p>
                      <div class="star-icon mt-3">
                        <span>
                          <i class="lni-star-filled"></i>
                        </span>
                        <span>
                          <i class="lni-star-filled"></i>
                        </span>
                        <span>
                          <i class="lni-star-filled"></i>
                        </span>
                        <span>
                          <i class="lni-star-filled"></i>
                        </span>
                        <span>
                          <i class="lni-star-half"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item">
                  <div class="testimonial-item">
                    <div class="img-thumb">
                      <img src="website/img/testimonial/img4.jpg" alt="" />
                    </div>
                    <div class="info">
                      <h2>
                        <a href="#">Fernanda Anaya</a>
                      </h2>
                      <h3>
                        <a href="#">Developer</a>
                      </h3>
                    </div>
                    <div class="content">
                      <p class="description">
                        Praesent cursus nulla non arcu tempor, ut egestas elit
                        tempus. In ac ex fermentum, gravida felis nec, tincidunt
                        ligula.
                      </p>
                      <div class="star-icon mt-3">
                        <span>
                          <i class="lni-star-filled"></i>
                        </span>
                        <span>
                          <i class="lni-star-filled"></i>
                        </span>
                        <span>
                          <i class="lni-star-half"></i>
                        </span>
                        <span>
                          <i class="lni-star-half"></i>
                        </span>
                        <span>
                          <i class="lni-star-half"></i>
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
      <section id="cta" class="section-padding">
        <div class="container">
          <div class="row">
            <div
              class="col-lg-6 col-md-6 col-xs-12 wow fadeInLeft"
              data-wow-delay="0.3s"
            >
              <div class="cta-text1">
                <h4>Try SUTYGON-BOT</h4>
                <p>Everything you need to manage rentals</p>
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
      </section>
      {/* contact form */}

      <section id="contact" class="section-padding bg-gray">
        <div class="container">
          <div class="section-header text-center">
            <h2 class="section-title wow fadeInDown" data-wow-delay="0.3s">
              Contact US
            </h2>
            <div class="shape wow fadeInDown" data-wow-delay="0.3s"></div>
          </div>
          <div class="row contact-form-area wow fadeInUp" data-wow-delay="0.3s">
            <div class="col-lg-6 col-md-12 col-sm-12">
              {/* <!-- Call To Action Section Start --> */}
              <section id="cta" class="section-padding">
                <div class="container">
                  <div class="row">
                    <div
                      class="col-lg-10 col-md-10 col-xs-12 wow fadeInLeft"
                      data-wow-delay="0.3s"
                    >
                      <form>
                        <div class="form-group">
                          <input
                            type="text1"
                            class="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Your Name"
                          />
                        </div>
                        <div class="form-group">
                          <input
                            type="email"
                            class="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Your email"
                          />
                        </div>
                        <div class="form-group">
                          <input
                            type="text1"
                            class="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Your Phone Number"
                          />
                        </div>
                        <textarea
                          class="contactfieldarea"
                          type="text1"
                          name="msg"
                          placeholder="Your Message"
                          required=""
                        ></textarea>
                        <button type="submit" class="btn1 btn1-common">
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div class="col-lg-6 col-md-12 col-xs-12">
              <div class="map h-100">
                <object
                  style={{ border: "0", height: "100%", width: "100%" }}
                  data="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d34015.943594576835!2d-106.43242624069771!3d31.677719472407432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86e75d90e99d597b%3A0x6cd3eb9a9fcd23f1!2sCourtyard+by+Marriott+Ciudad+Juarez!5e0!3m2!1sen!2sbd!4v1533791187584"
                ></object>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* footer section */}
      <footer id="footer" class="footer-area section-padding">
        <div class="container">
          <div class="container">
            <div class="row">
              <div class="col-lg-3 col-md-6 col-sm-6 col-xs-6 col-mb-12">
                <div class="widget">
                  <h3 class="footer-logo">
                    <img src="website/logo.png" height="100px" alt="" />
                  </h3>
                  <div class="textwidget">
                    <p>
                      Approved by Calum Nguyen <br /> on 12-16-2020.
                    </p>
                  </div>
                  <div class="social-icon">
                    <a class="facebook" href="#">
                      <i class="lni-facebook-filled"></i>
                    </a>
                    <a class="twitter" href="#">
                      <i class="lni-twitter-filled"></i>
                    </a>
                    <a class="instagram" href="#">
                      <i class="lni-instagram-filled"></i>
                    </a>
                    <a class="linkedin" href="#">
                      <i class="lni-linkedin-filled"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                <h3 class="footer-titel">Products</h3>
                <ul class="footer-link">
                  <li>
                    <a href="#">Tracking</a>
                  </li>
                  <li>
                    <a href="#">Application</a>
                  </li>
                  <li>
                    <a href="#">Resource Planning</a>
                  </li>
                  <li>
                    <a href="#">Enterprise</a>
                  </li>
                  <li>
                    <a href="#">Employee Management</a>
                  </li>
                </ul>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                <h3 class="footer-titel">Resources</h3>
                <ul class="footer-link">
                  <li>
                    <a href="#">Payment Options</a>
                  </li>
                  <li>
                    <a href="#">Fee Schedule</a>
                  </li>
                  <li>
                    <a href="#">Getting Started</a>
                  </li>
                  <li>
                    <a href="#">Identity Verification</a>
                  </li>
                  <li>
                    <a href="#">Card Verification</a>
                  </li>
                </ul>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                <h3 class="footer-titel">Contact</h3>
                <ul class="address">
                  <li>
                    <a href="#">
                      <i class="lni-map-marker"></i> 105 Madison Avenue - <br />{" "}
                      Third Floor New York, NY 10016
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="lni-phone-handset"></i> P: +84 846 250 592
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="lni-envelope"></i> E: contact@uideck.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div id="copyright">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <div class="copyright-content">
                  <p>
                    Ownership of{" "}
                    <a
                      class="px-2"
                      rel="nofollow"
                      href="https://www.sutygon.com/"
                    >
                      SUTYGON-BOT
                    </a>{" "}
                    All Right Reserved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* Go to Top Link */}
      <a href="#" class="back-to-top">
        <i class="lni-arrow-up"></i>
      </a>
      {/* preloader */}
      {/* <div id="preloader">
        <div class="loader" id="loader-1"></div>
      </div> */}
    </React.Fragment>
  );
}
