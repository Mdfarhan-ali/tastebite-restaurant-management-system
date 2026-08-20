import { Component } from '@angular/core';
import { Hero } from "../../components/hero/hero";
import { WhyChooseUs } from "../../components/why-choose-us/why-choose-us";
import { PopularDishes } from '../../components/popular-dishes/popular-dishes';
import { SpecialOffer } from "../../components/special-offer/special-offer";
import { OurChefs } from "../../components/our-chefs/our-chefs";
import { Gallery } from "../../components/gallery/gallery";
import { ReservationCta } from "../../components/reservation-cta/reservation-cta";
import { Testimonials } from "../../components/testimonials/testimonials";
import { LatestBlogs } from "../../components/latest-blogs/latest-blogs";

@Component({
  selector: 'app-home',
  imports: [Hero, WhyChooseUs, PopularDishes, SpecialOffer, OurChefs, Gallery, ReservationCta, Testimonials, LatestBlogs],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
