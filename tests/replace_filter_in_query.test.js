const { buildNewUrl } = require("../src/scripts/string-utils");

describe("add requestId filter", () => {
  it("when query doesn't have any filter", () => {
    const currentUrl =
      "https://my-region-1.console.aws.amazon.com/cloudwatch/home?region=my-region-1#logsV2:logs-insights$3FqueryDetail$3D~(end~0~start~-3600~timeType~'RELATIVE~tz~'LOCAL~unit~'seconds~editorString~'fields*20*40timestamp*2c*20*40message*2c*20*40logStream*2c*20*40log*0a*7c*20sort*20*40timestamp*20desc*0a*7c*20limit*2010000~queryId~'1234e25-a7dc-4908-bfb6-524822921a90~source~(~'arn*3aaws*3alogs*3amy-region-1*3a123412341234*3alog-group*3a*2faws-glue*2fcolumn-statistics))";
    const requestId = "123e4567-e89b-12d3-a456-426614174000";

    const newUrl = buildNewUrl(currentUrl, requestId);
    console.log("newUrl", newUrl);
    expect(newUrl).toContain(`filter*20*40requestId*3d*27${requestId}*27`);
  });
  it("should replace filter with requestId", () => {
    const currentUrl =
      "https://my-region-1.console.aws.amazon.com/cloudwatch/home?region=my-region-1#logsV2:logs-insights$3FqueryDetail$3D~(end~0~start~-3600~timeType~'RELATIVE~tz~'LOCAL~unit~'seconds~editorString~'fields*20*40timestamp*2c*20*40message*2c*20*40logStream*2c*20*40log*0a*7c*20filter*20*40message*20like*20*27teste*27*20and*20*40message*20like*20*27teste2*27*0a*7c*20sort*20*40timestamp*20desc*0a*7c*20limit*2010000~queryId~'12341e25-a7dc-4908-bfb6-123412341234a90~source~(~'*2faws-glue*2fcolumn-statistics))";
    const requestId = "123e4567-e89b-12d3-a456-426614174000";

    const newUrl = buildNewUrl(currentUrl, requestId);

    expect(newUrl).toContain(
      `filter*20*40requestId*3d*27${requestId}*27*20and*20`
    );
  });
});
