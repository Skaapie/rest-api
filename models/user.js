'use strict';
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            field: 'id',
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4()
        },
        email: {
            type: DataTypes.STRING(255),
            field: 'email',
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password_hash: {
            type: DataTypes.STRING,
            field: 'password_hash',
            allowNull: true
        },
        password: {
            type: DataTypes.VIRTUAL,
            set: function(val) {
                this.setDataValue('password', val); // Remember to set the data value, otherwise it won't be validated
                this.setDataValue('password_hash', val);
            }
        },
        role: {
            type: DataTypes.ENUM('User', 'Admin'),
            field: 'role',
            allowNull: false,
            defaultValue: 'User'
        },
        verifyToken: {
            type: DataTypes.STRING,
            field: 'verifyToken',
            allowNull: true
        },
        verified: {
            type: DataTypes.BOOLEAN,
            field: 'verified',
            allowNull: false,
            defaultValue: false
        }
    }, {
        instanceMethods: {
            comparePassword: function(suppliedPassword, cb) {
                bcrypt.compare(suppliedPassword, this.getDataValue('password_hash'), cb);
            }
        },
        classMethods: {
            // associate: function(models) { }
        },
        hooks: {
            beforeValidate: function(user, options, cb) {
                if (user.isNewRecord) {
                    crypto.randomBytes(20, function(err, buf) {
                        if (err) {
                            return cb(err);
                        }
                        user.verifyToken = buf.toString('hex');
                    });
                }

                if (user.changed('password')) {
                    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                        if (err) {
                            return cb(err);
                        }

                        bcrypt.hash(user.password, salt, function(err, hash) {
                            if (err) {
                                return cb(err);
                            }
                            user.password_hash = hash;
                            cb(null, user);
                        });
                    });
                } else {
                    cb(null);
                }
            }
        }
    });
    return User;
};