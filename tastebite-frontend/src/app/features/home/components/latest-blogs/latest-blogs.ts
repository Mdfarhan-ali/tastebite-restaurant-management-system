import { Component } from '@angular/core';
import { Container } from '../../../../shared/components/container/container';
import { BLOGS } from '../../data/blog.data';

@Component({
  selector: 'app-latest-blogs',
  imports: [Container],
  templateUrl: './latest-blogs.html',
  styleUrl: './latest-blogs.css'
})
export class LatestBlogs {
  blogs = BLOGS;
}