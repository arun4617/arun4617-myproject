export class SlideKeywordQueryRequest {
    index: String;
    queryJson: QueryJSON;

    constructor() {
        this.queryJson = new QueryJSON();
    }
}

export class QueryJSON {
    Keywords: String[];
}