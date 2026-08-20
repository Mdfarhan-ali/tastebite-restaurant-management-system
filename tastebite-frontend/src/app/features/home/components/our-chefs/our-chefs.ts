import { Component } from '@angular/core';
import { Container } from '../../../../shared/components/container/container';
import { CHEFS } from '../../data/chef.data';


import {
  LucideAngularModule,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-angular';

@Component({
  selector: 'app-our-chefs',
  standalone: true,
  imports: [
    Container,
    LucideAngularModule
  ],
  templateUrl: './our-chefs.html',
  styleUrl: './our-chefs.css',
})
export class OurChefs {

  chefs = CHEFS;

  readonly Instagram = Instagram;
  readonly Facebook = Facebook;
  readonly Twitter = Twitter;

}