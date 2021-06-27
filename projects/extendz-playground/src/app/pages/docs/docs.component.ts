import { Component, OnInit } from '@angular/core';

interface MenuItem {
  name: string;
  subTitle?: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss'],
})
export class DocsComponent implements OnInit {
  compound: MenuItem[] = [
    { name: 'Root', icon: 'apps', url: 'compound/root', subTitle: '/' },
    { name: 'Data table', icon: 'table_view', url: 'compound/data-table', subTitle: '/products' },
    { name: 'Entity', icon: 'feed', url: 'compound/entity',subTitle:'/products/PRO-0001' },
  ];

  core: MenuItem[] = [
    { name: 'Enum', icon: 'keyboard', url: '/root' },
    { name: 'String', icon: 'keyboard', url: '/root' },
    { name: 'Email', icon: 'keyboard', url: '/root' },
    { name: 'Number', icon: 'keyboard', url: '/root' },
    { name: 'Boolean', icon: 'keyboard', url: '/root' },
  ];

  pro: MenuItem[] = [
    { name: 'Money', icon: 'attach_money', url: '/root' },
    { name: 'Phone', icon: 'phone', url: '/root' },
    { name: 'Select', icon: 'task', url: '/root' },
    { name: 'Embedded', icon: 'keyboard', url: '/root' },
    { name: 'Matrix', icon: 'view_module', url: '/root' },
    { name: 'Image', icon: 'image', url: '/root' },
    { name: 'Color', icon: 'palette', url: '/root' },
    { name: 'Unit of measure', icon: 'keyboard', url: '/root' },
  ];

  basic: MenuItem[] = [
    { name: 'Select', icon: 'keyboard', url: '/root' },
    { name: 'Table', icon: 'table', url: '/root' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
