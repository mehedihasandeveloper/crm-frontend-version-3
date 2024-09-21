import { TestBed } from '@angular/core/testing';

import { CsvService } from './csv.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CsvService', () => {
  let service: CsvService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Include HttpClientTestingModule
      providers: [CsvService] // Provide the service
    });
    service = TestBed.inject(CsvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});