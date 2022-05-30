const sinon = require("sinon");
const users = require("./users");
let getUserstub = sinon.stub(users, "getUser");
test("Should return the number 1", async () => {
  getUserstub.resolves("Yay :D");
  let user = await users.getUser();
  console.log(user);
  expect(user).toBe("Yay :D");
});
