import { Component } from '@angular/core';
import { Container } from '../../../../shared/components/container/container';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-reservation-cta',
  imports: [
    Container,
    Button
  ],
  templateUrl: './reservation-cta.html',
  styleUrl: './reservation-cta.css',
})
export class ReservationCta {}