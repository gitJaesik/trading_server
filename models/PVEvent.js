module.exports = (seq, Seq) => {
  return seq.define("pvevent", {
    idx: {
        type: Seq.BIGINT,
        allowNull: false,
        validate: {notEmpty: true}
    },
    tick_id: {
        type: Seq.INTEGER,
        allowNull: false,
        validate: {notEmpty: true}
    },
    cryp_exchange_no: {
        type: Seq.STRING,
        allowNull: false,
        validate: {notEmpty: true}
    },
    base_coin_market_no: {
        type: Seq.STRING,
        allowNull: false,
        validate: {notEmpty: true}
    },
    coin_no: {
        type: Seq.STRING,
        allowNull: false,
        validate: {notEmpty: true}
    },
    price_change: {
        type: Seq.DOUBLE
    },
    volume_change: {
        type: Seq.DOUBLE
    },
    former_price: {
        type: Seq.DOUBLE
    },
    former_volume: {
        type: Seq.DOUBLE
    },
    latter_price: {
        type: Seq.DOUBLE
    },
    latter_volume: {
        type: Seq.DOUBLE
    }
  }, {
    classMethods: {
      relate: (models) => {
        models.PVEvent.hasMany(models.Exchange);
        models.PVEvent.hasMany(models.MarketName);
        models.PVEvent.hasMany(models.Coin);
      }
    }
  });
};