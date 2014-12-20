<form class="list-wrap" name="order" ng-controller="ReserveCtrl">
  <div>
    <ul class="list">
      <li ng-repeat="dish in dishes">
        <div class="name">
          <span class="itemname">{{ dish.name }}</span>
          <span class="price">￥{{ dish.price }}元</span>
          <small>{{ dish.content }}</small>
        </div>
        <div class=" ope-wrap">
          <span class="minus" ng-click="subItemCount(dish)">-</span>
          <input type="text" value="{{ dish.count }}" class="ope-wrap-item itemnum" disabled="">
          <span class="plus" ng-click="addItemCount(dish)">+</span>
          <div class="favor">
            <small>口味选择：</small>
            <span class="favor-button selected">正常</span>
            <span class="favor-button">加辣</span>
          </div>
        </div>
      </li>
    </ul>
    <div class="name">
      饮料（3元/个）：<br/>
      <ul class="list">
        <li class="drink-wrap" ng-repeat="drink in drinks">
          <div style="display:inline-block">
            <span class="drink-name">{{ drink.name }}</span>
            <span class=" drink-ope-wrap">
              <span class="minus" ng-click="subItemCount(drink)">-</span>
              <input value="{{ drink.count }}" class="itemnum" disabled="">
              <span class="plus" ng-click="addItemCount(drink)">+</span>
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div class="result-wrap">
    <span class="label">宿舍楼号</span>
    <input type="number" name="building"  value="" placeholder="如“4”">
    <br/>
    <span class="label">房间号</span>
    <input type="text" name="room"  value="" placeholder="如“中404”">
    <br/>
    <span class="label">联系电话</span>
    <input type="number" name="phone" value="">
    <br/>
    <span class="label">优惠码</span>
    <input id="discountCode" type="number" name="discountCode" value="">
    <br/>
    <span class="label">送餐时间</span>
    <select id="deliver-time" name="time" value="">
      <option value="" ng-repeat="deltime in deltimes" ng-disabled="{{ !deltime.valid }}">
        {{ deltime.time }}
      </option>
    </select>
    <br/>
    <div class="submit">
      共计
      <span id="sum">{{ priceSum }}</span>
      元
      <a id='submit' ng-click="submitOrder">确认</a>
    </div>
  </div>
  <!-- <div ng-repeat="newsItem in news">news</div> -->
</form>