const { faker } = require("@faker-js/faker");
const { findRequestId } = require("../src/scripts/string-utils");

describe("findRequestId", () => {
  it("return null when there is no requestId", () => {
    const text = "filter @message like 'teste'";
    const requestId = findRequestId(text);
    expect(requestId).toBeNull();
  });

  describe("return requestId when it is present", () => {
    const uuids = [];
    for (let i = 0; i < 10; i++) {
      uuids.push(faker.string.uuid());
    }
    it.each(uuids)("return requestId when it is present", (uuid) => {
      const log = `2024-10-25T19:54:47.253Z	${uuid}	INFO	{"_aws":{"Timestamp":1729186087253,"CloudWatchMetrics":[{"Namespace":"my-project-core","Dimensions":[["service","FunctionName"]],"Metrics":[{"Name":"Success","Unit":"Count"}]}]},"service":"my-project-core","FunctionName":"my-consumer","Success":1}`;
      const requestId = findRequestId(log);
      expect(requestId).toBe(uuid);
    });
  });

  it("return first requestId when it is present", () => {
    const log1 =
      '2024-10-25T19:54:47.253Z	daf15ded-ebba-50e9-9cb0-0278120237ba	INFO	{"_aws":{"Timestamp":1729186087253,"CloudWatchMetrics":[{"Namespace":"my-project-core","Dimensions":[["service","FunctionName"]],"Metrics":[{"Name":"Success","Unit":"Count"}]}]},"service":"my-project-core","FunctionName":"my-consumer","Success":1}';
    const log2 =
      '2024-10-25T19:54:47.253Z	423a1b6a-d50c-5f63-8832-44ff22ec8e81	INFO	{"_aws":{"Timestamp":1729186087251,"CloudWatchMetrics":[{"Namespace":"my-project-core","Dimensions":[["service","FunctionName"]],"Metrics":[{"Name":"Success","Unit":"Count"}]}]},"service":"my-project-core","FunctionName":"my-consumer","Success":1}';
    const requestId = findRequestId(log1 + log2);
    expect(requestId).toBe("daf15ded-ebba-50e9-9cb0-0278120237ba");
  });
});
