// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
);

const originalConfigureTestingModule = TestBed.configureTestingModule.bind(TestBed);
(TestBed as any).configureTestingModule = (metadata: any = {}) => originalConfigureTestingModule({
  ...metadata,
  imports: [
    HttpClientTestingModule,
    RouterTestingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ...(metadata.imports || [])
  ],
  providers: [
    {
      provide: ActivatedRoute,
      useValue: {
        snapshot: { params: {}, queryParams: {}, paramMap: { get: () => null } },
        params: of({}),
        queryParams: of({})
      }
    },
    ...(metadata.providers || [])
  ],
  schemas: [NO_ERRORS_SCHEMA, ...(metadata.schemas || [])]
});

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
