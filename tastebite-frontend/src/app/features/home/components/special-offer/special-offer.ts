import { Component } from '@angular/core';
import { Container } from '../../../../shared/components/container/container';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-special-offer',
  imports: [
    Container,
    Button
  ],
  templateUrl: './special-offer.html',
  styleUrl: './special-offer.css'
})
export class SpecialOffer {}