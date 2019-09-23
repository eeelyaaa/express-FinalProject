module.exports = function (models) {
    models.posts.belongsTo(models.users,
        {
            through: models.users,
            foreignKey: 'UserId'
        });
    models.users.hasMany(models.posts,
        {
            foreignKey: 'UserId',
            targetKey: 'UserId'
        }
    )
}
