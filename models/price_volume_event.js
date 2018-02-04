module.exports = (seq, Seq) => {
  return seq.define("blog", {
    idx: {
        type: Seq.INTEGER,
        allowNull: false,
        validate: {notEmpty: true}
    },
    password: {
        type: Seq.STRING,
        allowNull: false,
        validate: {notEmpty: true}
    },
    name: {
        type: Seq.STRING,
        allowNull: false,
        validate: {notEmpty: true}
    },
    facebook_url: {
        type: Seq.STRING,
        validate: {isUrl: true}
    },
    email: {
        type: Seq.STRING,
        allowNull: false,
        validate: {isEmail: true}
    },
    lat: {
        type: Seq.DOUBLE
    },
    lang: {
        type: Seq.DOUBLE
    },
    fax: {
        type: Seq.STRING,
        validate: {
            is: /^[-+0-9]+$/
        }
    },
    phone: {
        type: Seq.STRING,
        validate: {
            is: /^[-+0-9]+$/
        }
    },
    contact_text: {
        type: Seq.TEXT
    }
  }, {
    classMethods: {
      relate: (models) => {
        models.Blog.hasMany(models.File);
        models.Blog.hasMany(models.Post);
        models.Blog.hasMany(models.Category);
        models.Blog.hasMany(models.Comment);

        models.Blog.belongsTo(models.Post, {as: 'aboutPost', constraints: false, foreignKey: 'fk_about_post_blog_id'});
        models.Blog.belongsTo(models.File, {as: 'logoFile', constraints: false, foreignKey: 'fk_logo_file_blog_id'});
      }
    }
  });
};