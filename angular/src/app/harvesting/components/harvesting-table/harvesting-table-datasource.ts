import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { HarvestingContent } from 'src/app/shared/models/harvesting-content.model';

/**
 * Data source for the RecordsTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class HarvestingTableDataSource extends DataSource<HarvestingContent> {
  data: HarvestingContent[];
  paginator: MatPaginator;
  sort: MatSort;

  constructor(value: HarvestingContent[]) {
    super();
    this.data = value;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<HarvestingContent[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: HarvestingContent[]) {
    return data;
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: HarvestingContent[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'harvestedSize': return compare(+a.harvestedSize, +b.harvestedSize, isAsc);
        case 'validSize': return compare(+a.validSize, +b.validSize, isAsc);
        case 'invalidRecords': return compare(+a.invalidRecords, +b.invalidRecords, isAsc);
        case 'transformedSize': return compare(+a.transformedSize, +b.transformedSize, isAsc);
        case 'startTime': return compare(+a.startTime, +b.startTime, isAsc);
        case 'endTime': return compare(+a.endTime, +b.endTime, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
