import { Component } from '@angular/core';
import { Container } from '../../../../shared/components/container/container';
import { Button } from "../../../../shared/components/button/button";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    RouterLink,
    Container,
    Button
],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {}